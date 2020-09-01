import requests
import bs4
from bs4 import BeautifulSoup
import pandas as pd
import time
import re

__URL__ = "https://www.indeed.com/jobs?"
__URL_LINKEDIN__ = "https://www.linkedin.com/jobs/search?"

_URL_DOCCAFE_ = "https://www.doccafe.com/jobs/search?"
_END_ = "&posted_period_all"

def get_job_details(df, source):
    jobDetailsList = []
    for i, j in df.iterrows():
        jobDetails = JobDetails(j["Job_title"], j["Company"], j["Location"], j["Summary"], j["Date"], j["Apply site"], source)
        jobDetailsList.append(jobDetails)
    return jobDetailsList

def get_jobs_new(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")
    jobs = soup.find_all(name="div", attrs={"class": "jobsearch-SerpJobCard unifiedRow row result"})
    dataframe_dict = {}
    companies = []
    for job in jobs:
        company = job.find_all(name="span", attrs={"class": "company"})
        if len(company) > 0:
            for b in company:
                companies.append(b.text.strip())
        else:
            sec_try = job.find_all(name="span", attrs={"class": "result-link-source"})
            for span in sec_try:
                companies.append(span.text)
    dataframe_dict["Company"] = companies
    job_titles = []
    apply_sites = []
    for job in jobs:
        for a in job.find_all(name="a", attrs={"data-tn-element": "jobTitle"}):
            job_titles.append(a["title"])
            apply_sites.append("https://www.indeed.com" + a["href"])
    dataframe_dict["Job_title"] = job_titles
    dataframe_dict["Apply site"] = apply_sites
    locations = []
    for job in jobs:
        c = job.findAll("span", attrs={"class": "location"})
        for span in c:
            locations.append(span.text)
    dataframe_dict["Location"] = locations
    summaries = []
    for job in jobs:
        d = job.findAll("div", attrs={"class": "summary"})
        for span in d:
            summaries.append(span.text.strip())
    dataframe_dict["Summary"] = summaries
    dates = []
    for job in jobs:
        date = job.findAll("span", attrs={"class": "date"})
        for span in date:
            dates.append(span.text.strip())
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


def prepare_url(key_word="", where=""):
    keyword = key_word.replace(" ", "+")
    keyword = keyword.replace(",", "%2C")
    keyword = keyword.replace("/", "%2F")
    where = where.replace(" ", "+")
    where = where.replace(",", "%2C")
    where = where.replace("/", "%2F")
    url = __URL__ + "&q=" + keyword + "&l=" + where
    df = get_jobs_new(url)
    return get_job_details(df, "Indeed")


def fetch_doccafe(url):
  page = requests.get(url)
  soup = BeautifulSoup(page.text, "html.parser")
  jobs = soup.find_all(name="div", attrs={"class": re.compile("list-group-item job-search-result.*")})
  df = pd.DataFrame(columns=["Job_title", "Company", "Location", "Date", "Apply site"])
  for job in jobs:
    job_title = ""
    company = ""
    location = ""
    date = ""
    apply_site = ""
    job_posting = []

    val = job.find("a", attrs={"class": "h5"})
    apply_site = "https://www.doccafe.com" + val["href"]
    count = 0

    for i in job.find_all("a", attrs={"class": "text-black"}):
      if count == 0:
        company = i.text
        count += 1
      else:
        job_title += i.text + "\n"

    for j in job.find_all("a", attrs={"class": "text-muted dashboard-action-icon-color"}):
      location += j.text + " "

    last_a_tag = job.find("i", attrs={"class": "fa fa-clock-o"})
    job_type = re.sub(" +", " ", str(last_a_tag.next_element.string).strip())

    last_a_tag = job.find("i", attrs={"class": "fa fa-calendar"})
    date = re.sub(" +", " ", str(last_a_tag.next_element.string).strip())

    job_posting.extend([job_title.strip(), company, location, date, apply_site])
    df_length = len(df)
    df.loc[df_length] = job_posting
  return df

def prepare_url_doccafe(key_word="", where=""):
    keyword = key_word.replace(" ", "%20")
    keyword = keyword.replace(",", "%2C")
    keyword = keyword.replace("/", "%2F")
    where = where.replace(" ", "+")
    where = where.replace(",", "%2C")
    where = where.replace("/", "%2F")
    url = _URL_DOCCAFE_ + "criteria=" + keyword + "&location=" + where + _END_
    df = fetch_doccafe(url)
    df["Summary"] = ""
    return get_job_details(df, "Doccafe")

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
  return get_job_details(df, "Linkedin")

class JobDetails:
    def __init__(self, jobTitle, company, location, summary, date, applyURL, source):
        self.jobTitle = jobTitle
        self.company = company
        self.location = location
        self.summary = summary
        self.date = date
        self.applyURL = applyURL
        self.source = source











