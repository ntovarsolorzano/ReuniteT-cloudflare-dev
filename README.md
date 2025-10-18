# ReuniteT

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ntovarsolorzano/ReuniteT-cloudflare-dev)

A visually stunning virtual rooms application where users move around as customizable avatars and engage in moderated, topic-based conversations.

ReuniteT is a vibrant and interactive web application designed to foster community and conversation through themed virtual rooms. Users can customize a playful, 'Among-Us' style avatar and enter various rooms based on categories like 'Videogames', 'Christian Life', or 'Veterans of War'. Inside each room, users can move their character around a 2D space using WASD keys and interact with others via a real-time chat. A key feature is the presence of an automated 'Moderator' character who posts thought-provoking prompts and questions related to the room's theme, guiding the conversation and encouraging meaningful discussion.

## Key Features

-   **Themed Virtual Rooms:** Join conversations based on a variety of interests and topics.
-   **Customizable Avatars:** Personalize your character's color, hat, and symbol for a unique identity.
-   **Real-time Interaction:** Move your avatar freely with WASD keys and see others in real-time.
-   **Moderated Discussions:** Engage in meaningful conversations guided by automated, topic-specific prompts.
-   **Modern UI/UX:** A beautiful, playful interface with both light and dark themes, built for a delightful user experience.
-   **Responsive Design:** Flawless experience across all device sizes, from mobile to desktop.

## Technology Stack

-   **Frontend:**
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [Framer Motion](https://www.framer.com/motion/) for animations
-   **Backend:**
    -   [Cloudflare Workers](https://workers.cloudflare.com/)
    -   [Hono](https://hono.dev/)
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for real-time state
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/reunitet.git
    cd reunitet
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running in Development Mode

To start the development server, which includes the Vite frontend and a local instance of the Cloudflare Worker, run:

```sh
bun dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will be accessible for API requests.

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account:
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the frontend and deploy the worker and static assets to Cloudflare.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ntovarsolorzano/ReuniteT-cloudflare-dev)

## Project Structure

-   `src/`: Contains the React frontend application code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `stores/`: Zustand state management stores.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the Hono backend code for the Cloudflare Worker.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: Application-specific API routes.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: TypeScript types and constants shared between the frontend and worker.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.