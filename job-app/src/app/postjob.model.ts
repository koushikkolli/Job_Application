export class PostJob{
    constructor(public userId: string, public country: string, public companyName: string, public jobTitle: string,
        public address: string, public city: string, public state: string, public zipCode: string,
        public jobType: string, public salary: string,public numberOfPositions: string,
        public description: string, public companyWebsite: string, public companyFb: string,
        public modeOfApplication: string, public reciveApplication:string, public education: string,
        public experience: string, public datePosted: Date){}
}
