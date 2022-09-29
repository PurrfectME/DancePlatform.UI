const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    let isAuthenticated = false;
    if(token)
      isAuthenticated = true;

    return isAuthenticated;
}

const getToken = () => localStorage.getItem('token');

const isOrganizer = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let isOrganizer = false;
    if(user && user.role === 'Organizer')
    isOrganizer = true;

    return isOrganizer;
}

const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user)
        return user.id;    
}

const getCurrentUserName = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user)
        return user.userName;  
}

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user)
        return user;
}

const isModerator = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let isModerator = false;
    if(user && user.role === 'Moderator')
    isModerator = true;

    return isModerator;
} 

const isUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let isModerator = false;
    if(user && user.role === 'User')
    isModerator = true;

    return isModerator;  
}

const storageHelper = {
    isAuthenticated,
    isOrganizer,
    getCurrentUserId,
    getToken,
    getCurrentUserName,
    getCurrentUser,
    isModerator,
    isUser,
}

export default storageHelper;