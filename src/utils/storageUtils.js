const USER_KEY = 'user'
export default {
    saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    getUser() {
        let user = JSON.parse(localStorage.getItem(USER_KEY)) || {}
        return user

    },
    removeUser() {
        localStorage.removeItem(USER_KEY)
    }

}
