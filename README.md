# StreamLink

A real-time video chat application where users can create rooms, join calls, and invite others via shareable invite links. Built with **Spring Boot**, **Angular**, **LiveKit**, and **PostgreSQL**.

![Tech Stack](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)
![LiveKit](https://img.shields.io/badge/LiveKit-0099FF?logo=livekit&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

## Video demonstration

[![Watch the demo](https://img.youtube.com/vi/VIRhzxo7tZo/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIRhzxo7tZo)

---

## Features

- **Video Rooms** — Create and join video rooms powered by LiveKit.
- **Public & Private Rooms** — Choose whether your room appears in Explore or is accessible only via invite link.
- **Invite Links** — Generate expiring, usage-limited invite links for private rooms (or any room).
- **Anonymous Guest Join** — People with an invite link can join a private room as a guest without registering.
- **Host Controls** — Room creators can manage invites, toggle visibility, and close rooms.
- **Explore Tab** — Browse public active rooms and join the conversation.
- **My Rooms** — Keep track of all rooms you created.
- **Secure Authentication** — JWT-based auth with Spring Security.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java, Spring Boot 3, Spring Security, Spring Data JPA, Flyway |
| **Frontend** | Angular 21, TypeScript, RxJS, SCSS |
| **Realtime** | LiveKit |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, Kubernetes, GitHub Actions |

---

## Credits

Built as a seminar project for the Faculty of Computer Science and Engineering, UKIM.

- Lea Lonchar
- Petar Avramovikj
