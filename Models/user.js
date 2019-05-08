class User{
    constructor(name,password,bornDate, address, idUserType)
    {
			this.id = User.incrementId();
		this.name = name;
		this.password = password;
		this.bornDate = bornDate;
		this.address = address;
		this.idUserType = 1;
		this.active = true;
		this.notifications = [];
		}
		
    static incrementId() {
			if (!this.latestId) this.latestId = 1
			else this.latestId++
			return this.latestId
		}
}