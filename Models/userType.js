class UserType {
    constructor(description) {
        this.id = UserType.incrementId();
        this.description = description;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
      }
}