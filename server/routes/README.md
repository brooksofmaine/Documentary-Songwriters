# API Routes
An exhaustive guide to all the API routes and what to send/expect from them.  
Path parameters are denoted by curly braces `{ }`.  
Query parameters are denoted by angle brackets `< >`.  
Body parameters should be passed in the body of the request, as form data.

**A user must be logged in to use any of these routes**, except for user create.  
Anytime the current user is referenced, we mean the user that is logged in.

**Errors**

401 - not logged in

# To Do

* Decide what level of detail to return if getting a user that is not the logged in user (list of groups, list of groups - private groups?)
* Remove password from user objects
* Lock down what time format to use in query and body parameters
* Who can add people to groups? admin only or any group member? configurable?
* Errors for recording routes

# User Routes

### Create User:
To create a new user

    POST /api/user/create

**Body Parameters:**

* username
* password
* email
* firstName
* lastName

**Response**

```
{
    "username": "foobar",
    "firstName": "Foo",
    "lastName": "Bar",
    "email": "email@email.com",
    "password": "changeMePlz",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "createdAt": "2019-11-21T02:12:29.860Z",
    "groups": [
        {"groupName", "myGroup"},
        {"groupName", "groupToo"}
    ]
}
```

**Errors**

400 - undefined fields  
409 - username taken

### Get User:
To get a user

    GET /api/user/{username}

**Response**

```
{
    "username": "foobar",
    "email": "email@email.com",
    "firstName": "Foo",
    "lastName": "Bar",
    "password": "changeMePlz",
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "groups": [
        {"groupName", "myGroup"},
        {"groupName", "groupToo"}
    ]
}
```

**Errors**

404 - user not found

### Get Recordings of User:
To get the recordings of a user between a time range

    GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>

**Query Parameters**

* lowBound - the lower bound of the time range to get recordings from (by start time)
* highBound - the higher bound

**Response**
```
[
    {
        "username": "foobar",
        "numPitches": 125,
        "instrument": "guitar",
        "description": "First round of practice!",
        "startTime": "2019-11-21T02:25:42.123Z",
        "endTime": "2019-11-21T02:29:15.396Z",
        "createdAt": "2019-11-21T02:29:16.025Z",
        "updatedAt": "2019-11-21T02:29:16.025Z"
    },
    {
        "username": "foobar",
        "numPitches": 127,
        "instrument": "guitar",
        "description": "I need more practice...",
        "startTime": "2019-11-21T02:31:33.091Z",
        "endTime": "2019-11-21T02:34:58.720Z",
        "createdAt": "2019-11-21T02:34:59.433Z",
        "updatedAt": "2019-11-21T02:34:59.433Z"
    }
]
```

**Errors**

404 - user not found

### Edit User:
To edit something about the current user

    POST /api/user/edit

**Body Parameters**

* key - the name of the attribute to change, either `username | password | email | firstName | lastName`
* value - the value to change the attribute to

**Response**
```
{
    "username": "foobar",
    "email": "email@email.com",
    "firstName": "Foo",
    "lastName": "Bar",
    "password": "changeMePlz",
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "groups": [
        {"groupName", "myGroup"},
        {"groupName", "groupToo"}
    ]
}
```

**Errors**

400 - key not recognized  
400 - undefined fields  
404 - user not found  
409 - username taken

# Group Routes

### Create Group
To create a group with the current user as the admin

    POST /api/group/create

**Body Parameters**

* groupName
* description
* visible - boolean `true | false`

**Response**

```
{
    "groupName": "MyGroup",
    "adminUsername": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "members": [
        {"username": "foobar"}
    ]
}
```

**Errors**

400 - undefined fields  
409 - group name taken

### Get Group
To get a group that is accessible to the current user

    GET /api/group/{groupName}

**Response**

```
{
    "groupName": "MyGroup",
    "adminUsername": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "members": [
        {"username": "foobar"},
        {"username": "friendlyUser"},
        {"username": "papa.guitar72"}
    ]
}
```

**Errors**

404 - group not found

### Add or Remove Group Member
To add or remove a group member as the admin (as a member of the group?)

    POST /api/group/{groupName}/add
    POST /api/group/{groupName}/remove

**Body Parameters**

* username - of user to add or remove

**Response**

```
{
    "groupName": "MyGroup",
    "adminUsername": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "members": [
        {"username": "foobar"},
        {"username": "friendlyUser"},
        {"username": "papa.guitar72"},
        {"username": "mama.uke71"}
    ]
}
```
**Errors**

404 - group not found  
404 - user not found

### Edit Group
To edit something about a group as the admin

    POST /api/group/{groupName}/edit

**Body Parameters**

* key - the name of the attribute to change, either `groupName | admin | description | visible`
* value - the value to change the attribute to

**Response**

```
{
    "groupName": "MyGroup",
    "adminUsername": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z",
    "members": [
        {"username": "foobar"},
        {"username": "friendlyUser"},
        {"username": "papa.guitar72"}
    ]
}
```
**Errors**

400 - key not recognized  
400 - undefined fields  
404 - group not found  
409 - groupName taken

### Delete Group
To delete a group as the admin

    POST /api/group/{groupName}/delete

**Response**

```
{
    "msg": "successfully deleted"
}
```

**Errors**

404 - group not found

# Recording Routes

### Create Recording
To create a recording as the current user

    POST /api/recording/create

**Body Parameters**

* numPitches - an integer
* instrument - a string
* description - a string
* startTime - a timestamp
* endTime - a timestamp

**Response**

```
{
    "username": foobar,
    "numPitches": 125,
    "instrument": "guitar",
    "description": "First round of practice!",
    "startTime": "2019-11-21T02:25:42.123Z",
    "endTime": "2019-11-21T02:29:15.396Z",
    "createdAt": "2019-11-21T02:29:16.025Z",
    "updatedAt": "2019-11-21T02:29:16.025Z"
}
```

### Edit Recording
To edit something about a recording as the creator of the recording

    POST /api/recording/edit

**Body Parameters**

* start - the start time of the recording
* key - the name of the attribute to change, either `description`
* value - the value to change the attribute to

**Response**

```
{
    "username": foobar,
    "numPitches": 125,
    "instrument": "guitar",
    "description": "First round of practice! - Went badly",
    "startTime": "2019-11-21T02:25:42.123Z",
    "endTime": "2019-11-21T02:29:15.396Z",
    "createdAt": "2019-11-21T02:29:16.025Z",
    "updatedAt": "2019-11-21T02:29:16.025Z"
}
```

### Delete Recording
To delete a recording as the creator of the recording

    POST /api/recording/delete

**Body Parameters**

* start - the start time of the recording

**Response**

```
{
    "msg": "successfully deleted"
}
```
