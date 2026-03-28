import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from '../components/layout'
import { Calendario } from "@/pages/Calendario";
import { Escolas } from "@/pages/Escolas";

export const Routes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, element: <div>Hello World</div> },
        { path: 'calendario', element: <Calendario /> },
        { path: 'escolas', element: <Escolas /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}