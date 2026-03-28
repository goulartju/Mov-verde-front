import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from '../components/layout'
import { Calendario } from "@/pages/Calendario";
import { Escolas } from "@/pages/Escolas";
import { Turmas } from "@/pages/Turmas";
import { Alunos } from "@/pages/Alunos";
import { Doacoes } from "@/pages/Doacoes";
import { Rankings } from "@/pages/Rankings";
import { Administrativo } from "@/pages/Administrativo";
import { Dashboard } from "@/pages/Dashboard";

export const Routes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'calendario', element: <Calendario /> },
        { path: 'escolas', element: <Escolas /> },
        { path: 'turmas', element: <Turmas /> },
        { path: 'alunos', element: <Alunos /> },
        { path: 'doacoes', element: <Doacoes /> },
        { path: 'rankings', element: <Rankings /> },
        { path: 'administrativo', element: <Administrativo /> },

      ],
    },
  ])

  return <RouterProvider router={router} />
}