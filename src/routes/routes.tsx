import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from '../components/layout'
import { Calendario } from "@/pages/Calendario/Calendario";
import { Escolas } from "@/pages/Escolas/Escolas";
import { Turmas } from "@/pages/Turmas/Turmas";
import { Alunos } from "@/pages/Alunos/Alunos";
import { Doacoes } from "@/pages/Doacoes/Doacoes";
import { Rankings } from "@/pages/Rankings/Rankings";
import { Administrativo } from "@/pages/Administrativo/Administrativo";
import { Dashboard } from "@/pages/Dashboard/Dashboard";

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