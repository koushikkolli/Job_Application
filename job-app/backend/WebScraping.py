import requests
import bs4
from bs4 import BeautifulSoup
import pandas as pd
import time
import utils as utils
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore



__URL__ = "https://www.indeed.com/jobs?"
__URL_LINKEDIN__ = "https://www.linkedin.com/jobs/search?"

def get_job_details(df, source):
    jobDetailsList = []
    for i, j in df.iterrows():
        jobDetails = JobDetails(j["Job_title"], j["Company"], j["Location"], j["Summary"], j["Date"], j["Apply site"], source, j["Apply URL"], j["Description"], j["Additional Details"], j["Keyword"])
        jobDetailsList.append(jobDetails)
    return jobDetailsList

def get_jobs_indeed(url):
    print(url)
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")
    jobs = soup.find_all(name="div", attrs={"class": "jobsearch-SerpJobCard unifiedRow row result"})
    dataframe_dict = {}
    companies = []
    for job in jobs:
        append_company = ""
        company = job.find_all(name="span", attrs={"class": "company"})
        if len(company) > 0:
            for b in company:
                append_company = b.text.strip()
        else:
            sec_try = job.find_all(name="span", attrs={"class": "result-link-source"})
            for span in sec_try:
                append_company = span.text
        companies.append(append_company)
    dataframe_dict["Company"] = companies
    job_titles = []
    apply_sites = []
    for job in jobs:
        append_job_title = ""
        append_apply_url = ""
        for a in job.find_all(name="a", attrs={"data-tn-element": "jobTitle"}):
            append_job_title = a["title"]
            append_apply_url = "https://www.indeed.com" + a["href"]
        job_titles.append(append_job_title)
        apply_sites.append(append_apply_url)
    print(len(job_titles))
    print(len(apply_sites))
    dataframe_dict["Job_title"] = job_titles
    dataframe_dict["Apply site"] = apply_sites
    locations = []
    for job in jobs:
        append_location = ""
        c = job.findAll("span", attrs={"class": "location"})
        for span in c:
            append_location = span.text
        locations.append(append_location)
    print(len(locations))
    dataframe_dict["Location"] = locations
    summaries = []
    for job in jobs:
        append_summary = ""
        d = job.findAll("div", attrs={"class": "summary"})
        for span in d:
            append_summary = span.text.strip()
        summaries.append(append_summary)
    print(len(summaries))
    dataframe_dict["Summary"] = summaries
    dates = []
    for job in jobs:
        append_date = ""
        date = job.findAll("span", attrs={"class": "date"})
        for span in date:
            append_date = span.text.strip()
        dates.append(append_date)
    print(len(dates))
    dataframe_dict["Date"] = dates
    return pd.DataFrame(dataframe_dict)


def get_apply_url(url):
    page1 = requests.get(url)
    soup1 = BeautifulSoup(page1.text, "html.parser")
    company_url = ""
    for a in soup1.find_all(name="a", text="Apply On Company Site"):
        company_url = a["href"]
    if company_url == "":
        company_url = url
    return company_url


def prepare_url_indeed(key_word="", where=""):
    keyword = key_word.replace(" ", "+")
    keyword = keyword.replace(",", "%2C")
    keyword = keyword.replace("/", "%2F")
    where = where.replace(" ", "+")
    where = where.replace(",", "%2C")
    where = where.replace("/", "%2F")
    url = __URL__ + "&q=" + keyword + "&l=" + where
    df = get_jobs_indeed(url)
    get_desc_indeed(df)
    df["Additional Details"] = ""
    df["Keyword"] = key_word
    return get_job_details(df, "Indeed")




def get_jobs_linkedin(url):
  page = requests.get(url)
  soup = BeautifulSoup(page.text, "html.parser")
  jobs = soup.find_all(name="ul", attrs={"class": "jobs-search__results-list"})
  df = pd.DataFrame(columns=["Job_title", "Company", "Location", "Date", "Apply site"])
  for job in jobs:
    for li in job.find_all(name="li"):
      job_posting = []
      posted_before = ""
      for title in li.find_all(name="h3", attrs={"class": "result-card__title job-result-card__title"}):
        job_posting.append(title.text)
      for company in li.find_all(name="h4", attrs={"class": "result-card__subtitle job-result-card__subtitle"}):
        job_posting.append(company.text)
      for location in li.find_all(name="span", attrs={"class": "job-result-card__location"}):
        job_posting.append(location.text)
      for posted in li.find_all(name="time", attrs={"class": "job-result-card__listdate"}):
        posted_before = posted.text
      if (posted_before == ""):
        for posted in li.find_all(name="time", attrs={"class": "job-result-card__listdate--new"}):
          posted_before = posted.text
      job_posting.append(posted_before)
      for link in li.find_all(name="a", attrs={"class": "result-card__full-card-link"}):
        job_posting.append(link["href"])

      df_length = len(df)
      df.loc[df_length] = job_posting
  return df

def prepare_url_linkedin(key_word="", where=""):
  keyword = key_word.replace(" ", "%20")
  keyword = keyword.replace(",", "%2C")
  keyword = keyword.replace("/", "%2F")
  where = where.replace(" ", "+")
  where = where.replace(",", "%2C")
  where = where.replace("/", "%2F")
  url = __URL_LINKEDIN__ + "keywords=" + keyword + "&location=" + where

  df = get_jobs_linkedin(url)
  df["Summary"] = ""
  df["Keyword"] = key_word
  get_desc_linkedin(df)
  return get_job_details(df, "Linkedin")

class JobDetails:
    def __init__(self, job_title, company, location, summary, date, apply_site, source, apply_URL, description, additional_details, key_word):
        self.jobTitle = job_title
        self.company = company
        self.location = location
        self.summary = summary
        self.date = date
        self.applySite = apply_site
        self.source = source
        self.applyURL = apply_URL
        self.description = description
        self.additionalDetails = additional_details
        self.keyWord = key_word


def get_desc_linkedin(df):
    apply_sites = list(df.loc[:, "Apply site"])
    descriptions = []
    apply_urls = []
    add_details = []
    i = 0
    for site in apply_sites:
        i = i + 1
        print(i)
        apply_page = requests.get(site)
        apply_soup = BeautifulSoup(apply_page.text, "html.parser")
        description = ""
        apply_url = ""
        job_type = ""
        add_detail = ""
        print(apply_soup.find(name="a", attrs={"class": "apply-button apply-button--link"}))
        description = apply_soup.find(name="div", attrs={"class": "show-more-less-html__markup"})
        description = str(description)
        #description = description.replace("<br/>", "\n")
        #description = description.replace("</li>", "\n")
        #description = description.replace("<li>", "*")
        #description = description.replace("<ul>", "")
        #description = description.replace("</strong>", "")
        #description = description.replace("<strong>", "")
        #description = description.replace("<em>", "")
        #description = description.replace("</em>", "")
        #description = description.replace("</ul>", "")
        #description = description.replace("</div>", "")
        #description = description.replace("</u>", "")
        #description = description.replace("<u>", "")
        description = description.replace("</div>", "")
        description = description[description.index(">") + 1:]
        tag = apply_soup.find(name="a", attrs={"class": "apply-button apply-button--link"})
        if tag is not None:
            apply_url = apply_soup.find(name="a", attrs={"class": "apply-button apply-button--link"})["href"]
        else:
            apply_url = site

        for tag in apply_soup.find(name="ul", attrs={"class": "job-criteria__list"}):
            add_detail = tag.find(name="h3").text + ": " + tag.find(name="span").text + "\n"
        descriptions.append(description)
        apply_urls.append(apply_url)
        add_details.append(add_detail)
    df["Description"] = descriptions
    df["Apply URL"] = apply_urls
    df["Additional Details"] = add_details


def get_desc_indeed(df):
    apply_sites = list(df.loc[:, "Apply site"])
    descriptions = []
    apply_urls = []
    for site in apply_sites:
            apply_page = requests.get(site)
            apply_soup = BeautifulSoup(apply_page.text, "html.parser")
            description = ""
            apply_url = ""
            job_type = ""
            description = apply_soup.find(name="div", attrs={"id":"jobDescriptionText"}).text
            url = apply_soup.find(name="a", attrs={"class":"icl-Button icl-Button--primary icl-Button--block"})
            if url is not None:
                apply_url = url["href"]
            else:
                url = site
            descriptions.append(description)
            apply_urls.append(apply_url)
    df["Description"] = descriptions
    df["Apply URL"] = apply_urls


if __name__ == "__main__":
    keywords = utils.__keywords__
    locations = utils.__locations__
    
    cred = credentials.Certificate(r'E:\Angular\Projects\job-app\backend\job-portal.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    for keyword in keywords:
        for location in locations:
            indeed_jobs = prepare_url_indeed(keyword, location)
            linkedin_jobs = prepare_url_linkedin(keyword, location)
            # Use a service account
            for obj in indeed_jobs:
                db.collection(u'FetchedJobs').add(obj.__dict__)
            for obj in linkedin_jobs:
                db.collection(u'FetchedJobs').add(obj.__dict__)
            
            









