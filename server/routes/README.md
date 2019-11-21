# API Routes
An exhaustive guide to all the API routes and what to send/expect from them.  
Path parameters are denoted by curly braces `{ }`.  
Query parameters are denoted by angle brackets `< >`.  
Body parameters should be passed in the body of the request, as form data.

**A user must be logged in to use any of these routes**, except for user create.  
Anytime the current user is referenced, we mean the user that is logged in.

# To Do

* Remove password from user objects
* Lock down what time format to use in query and body parameters
* Who can add people to groups? admin only or any group member? configurable?

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
    "createdAt": "2019-11-21T02:12:29.860Z"
}
```

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
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

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
        "start": "2019-11-21T02:25:42.123Z",
        "end": "2019-11-21T02:29:15.396Z",
        "createdAt": "2019-11-21T02:29:16.025Z",
        "updatedAt": "2019-11-21T02:29:16.025Z"
    },
    {
        "username": "foobar",
        "numPitches": 127,
        "instrument": "guitar",
        "description": "I need more practice...",
        "start": "2019-11-21T02:31:33.091Z",
        "end": "2019-11-21T02:34:58.720Z",
        "createdAt": "2019-11-21T02:34:59.433Z",
        "updatedAt": "2019-11-21T02:34:59.433Z"
    }
]
```

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
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

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
    "admin": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "members": [
        "foobar",
        "friendlyUser",
        "papa.guitar72"
    ],
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

### Get Group
To get a group that is accessible to the current user

    GET /api/group/{groupName}

**Response**

```
{
    "groupName": "MyGroup",
    "admin": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "members": [
        "foobar",
        "friendlyUser",
        "papa.guitar72"
    ],
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

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
    "admin": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "members": [
        "foobar",
        "friendlyUser",
        "papa.guitar72",
        "mama.uke71"
    ],
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

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
    "admin": "foobar",
    "description": "A group for friends to track their music progress",
    "visible": true,
    "members": [
        "foobar",
        "friendlyUser",
        "papa.guitar72"
    ],
    "createdAt": "2019-11-21T02:12:29.860Z",
    "updatedAt": "2019-11-21T02:12:29.860Z"
}
```

### Delete Group
To delete a group as the admin

    POST /api/group/{groupName}/delete

**Response**

```
{
    "msg": "successfully deleted"
}
```

# Recording Routes

### Create Recording
To create a recording as the current user

    POST /api/recording/create

**Body Parameters**

* numPitches - an integer
* instrument - a string
* description - a string
* start - a timestamp
* end - a timestamp

**Response**

```
{
    "username": foobar,
    "numPitches": 125,
    "instrument": "guitar",
    "description": "First round of practice!",
    "start": "2019-11-21T02:25:42.123Z",
    "end": "2019-11-21T02:29:15.396Z",
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
    "start": "2019-11-21T02:25:42.123Z",
    "end": "2019-11-21T02:29:15.396Z",
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
