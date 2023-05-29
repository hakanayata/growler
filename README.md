# Harvard CS50W's Web Programming with Python and JavaScript 

## Project 4:  Network

A Twitter-like social media platform where users can create posts, follow other users, and interact with each other's post. It provides a way for users to share their thoughts, and engage in conversations with others.

This was project 4 of Harvard's CS50W course and was built with Python, Django Framework, JavaScript, MySQL, HTML, CSS, Bootstrap.

## Demo

As part of my course submission, I have recorded a concise screencast where I go through the required specification, and some other extra features I've implemented.
You might watch it on: [YouTube](https://youtu.be/vXhqK-ksxnU)
Or you might test it on: [Python Anywhere](http://growler.eu.pythonanywhere.com/)

## Specification

This project was developed based on the following [specification](https://cs50.harvard.edu/web/2020/projects/4/network/#specification):

- **New Post**: Users who are signed in should be able to write a new text-based post by filling in text into a text area and then clicking a button to submit the post.

- **All Posts**:  The “All Posts” link in the navigation bar should take the user to a page where they can see all posts from all users, with the most recent posts first.
  - Each post should include the username of the poster, the post content itself, the date and time at which the post was made, and the number of “likes” the post has (this will be 0 for all posts until you implement the ability to “like” a post later).
- **Profile Page**: Clicking on a username should load that user’s profile page. This page should:
  - Display the number of followers the user has, as well as the number of people that the user follows.
  - Display all of the posts for that user, in reverse chronological order.
  - For any other user who is signed in, this page should also display a “Follow” or “Unfollow” button that will let the current user toggle whether or not they are following this user’s posts. Note that this only applies to any “other” user: a user should not be able to follow themselves.
- **Following**: The “Following” link in the navigation bar should take the user to a page where they see all posts made by users that the current user follows.
  - This page should behave just as the “All Posts” page does, just with a more limited set of posts.
  - This page should only be available to users who are signed in.
- **Pagination**: On any page that displays posts, posts should only be displayed 10 on a page. If there are more than ten posts, a “Next” button should appear to take the user to the next page of posts (which should be older than the current page of posts). If not on the first page, a “Previous” button should appear to take the user to the previous page of posts as well.
- **Edit Post**: Users should be able to click an “Edit” button or link on any of their own posts to edit that post.
  - When a user clicks “Edit” for one of their own posts, the content of their post should be replaced with a textarea where the user can edit the content of their post.
  - The user should then be able to “Save” the edited post. Using JavaScript, you should be able to achieve this without requiring a reload of the entire page.
  - For security, ensure that your application is designed such that it is not possible for a user, via any route, to edit another user’s posts.
- **"Like" and "Unlike"**: Users should be able to click a button or link on any post to toggle whether or not they “like” that post.
  - Using JavaScript, you should asynchronously let the server know to update the like count (as via a call to fetch) and then update the post’s like count displayed on the page, without requiring a reload of the entire page.

<br>

## Extra Features
- Delete Post: Users have the ability to delete posts, and what adds to the experience is the smooth animation that accompanies the deletion process.
- Bio: Users can add descriptive, interesting information about them, and this can be modified on their profile pages.
- Reply: Users can reply to any post.
- Light/Dark Mode: Users have an option to switch between two different themes.
  
## Languages & Tools

- Python
- Django
- HTML
- CSS
- Bootstrap 
- JavaScript
- MySQL
- Python Anywhere
- SQLite3
- Visual Studio Code (with a vim extension)

<br>

## Credits
- `login`, `logout`, `register` view functions utilized in this project were prepared by Harvard's CS50W staff.

## Feedback
You might be able to test this application at: [http://growler.eu.pythonanywhere.com/](http://growler.eu.pythonanywhere.com/).
I would appreciate any kind of feedback. (See ***Contact*** below)


## Contact
I'm [Hakan](https://hakanayata.com). You could reach me at info@hakanayata.com


<br>

``` python
    print("Thanks for visiting this page!")
```
