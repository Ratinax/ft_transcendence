# Ft_transcendence
<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#Some screenshots">Some Screenshots</a></li>
    <li><a href="#Annex">Usage</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a 42 project, the aim is to create a website, with authentification, chat system and pong

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* <img src="https://img.shields.io/badge/-NestJs-ea2845?style=flat-square&logo=nestjs&logoColor=white">
* <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D">

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
### Prerequisites

* docker
* having no service running on port 3000, 5432, 8000,
	to verify:
  ```sh
  netstat -an | grep port_number
  ```


### Execution

   ```sh
   docker-copmpose up --build
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Some screenshots

* First we got the login page
![Login](screenshots/login.png)
* Our user page
![User](screenshots/user_page.png)
* The chat / channel page
![Chat](screenshots/chat.png)
* Creating a new channel
![Create Channel](screenshots/create_channel.png)
* Launch game menu
![Launch Game](screenshots/launch_game.png)
* The game itself
![Game](screenshots/game.png)
* List of users / friends or blocking
![List](screenshots/user_list.png)
* Our friend page (we can see he beat us in our single game)
![Other User](screenshots/other_user.png)

## Annex

If you are a 42 student and you want to use the 42 Login method, dm me using my login: tibernot

<p align="right">(<a href="#readme-top">back to top</a>)</p>
