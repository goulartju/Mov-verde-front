import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from '../components/layout'
import { Calendario } from "@/pages/Calendario";
import { Escolas } from "@/pages/Escolas";
import { Turmas } from "@/pages/Turmas";

export const Routes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, element: <div>Hello World</div> },
        { path: 'calendario', element: <Calendario /> },
        { path: 'escolas', element: <Escolas /> },
        { path: 'turmas', element: <Turmas /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}