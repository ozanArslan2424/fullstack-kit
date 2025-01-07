import { QueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./styles.css";

const rootElement = document.getElementById("root")!;

if (!rootElement) {
	throw new Error("Root element not found");
}

if (rootElement.innerHTML) {
	throw new Error("Root element must be empty");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(<App queryClient={queryClient} />);
