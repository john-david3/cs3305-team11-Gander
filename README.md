# **Team 11 Project Proposal**

## <span style="text-decoration:underline;">Main Idea</span>

Our main idea for this project is to create a live streaming service. This project will involve a front end that users can access to watch live streams and a back end that controls the functionality of the web app.

There will be 3 layers of access control: 



1. No Access - user not logged in
Users who are not logged in will only be able to view live streams.

2. Regular Access - user logged in (majority of users on the site)
Logged-in users will be able to donate to other users who are streaming (possibly via a third party service such as Stripe), comment on a live stream, and perform other features like following different users. Alternatively, a logged-in user may wish to livestream themselves, in which they become a ‘creator’.

3. Admin Access - admin user logged in
Admin users will have full control over the web app, including being able to do everything the two levels below can do and more, for example banning accounts when necessary.

We will create a group Github repository on which all of our work will be stored.

## <span style="text-decoration:underline;">Programming Languages</span>

In terms of how we would program this service, we have decided to use HTML, CSS and JavaScript for the front end, so something like React could be used to facilitate ease of creation. Then for the backend, we would use a language like Python that has a web framework like Flask to allow us to create functionality on the web app. Python, we believe, is more suited to this particular project as it has more useful modules and all group members are more familiar with its syntax and behaviour. However, we have also considered using Go. As well as this, a database would be needed to allow us to store user information and metadata. We are planning on using MySQL or PostgreSQL depending on which better meets our needs, when the time comes. We may also use TypeScript either on the web app or for writing documentation.
