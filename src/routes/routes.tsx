import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Navigate, Outlet } from "react-router";
import Layout from '../components/layout';
import Login from "@/pages/Login/Login";
import Calendario from "@/pages/Calendario/Calendario";
import { CalendariosProvider } from "@/pages/Calendario/CalendariosContext";
import Escolas from "@/pages/Escolas/Escolas";
import { EscolasProvider } from "@/pages/Escolas/EscolasContext";
import { Turmas } from "@/pages/Turmas/Turmas";
import { TurmasProvider } from "@/pages/Turmas/TurmasContext";
import { Alunos } from "@/pages/Alunos/Alunos";
import { AlunosProvider } from "@/pages/Alunos/AlunosContext";
import { Doacoes } from "@/pages/Doacoes/Doacoes";
import { DoacoesProvider } from "@/pages/Doacoes/DoacoesContext";
import { Rankings } from "@/pages/Rankings/Rankings";
import { Administrativo } from "@/pages/Administrativo/Administrativo";
import { UsuariosProvider } from "@/pages/Administrativo/UsuariosContext";
import { Dashboard } from "@/pages/Dashboard/Dashboard";
import config from "@/config/constants";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const Routes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      Component: PrivateRoute,
      children: [
        {
          path: '/',
          Component: Layout,
          children: [
            {
              index: true,
              element: (
                <EscolasProvider>
                  <TurmasProvider>
                    <AlunosProvider>
                      <DoacoesProvider>
                        <Dashboard />
                      </DoacoesProvider>
                    </AlunosProvider>
                  </TurmasProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'calendario',
              element: (
                <EscolasProvider>
                  <CalendariosProvider>
                    <Calendario />
                  </CalendariosProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'escolas',
              element: (
                <EscolasProvider>
                  <Escolas />
                </EscolasProvider>
              ),
            },
            {
              path: 'turmas',
              element: (
                <EscolasProvider>
                  <CalendariosProvider>
                    <UsuariosProvider>
                      <TurmasProvider>
                        <Turmas />
                      </TurmasProvider>
                    </UsuariosProvider>
                  </CalendariosProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'alunos',
              element: (
                <EscolasProvider>
                  <TurmasProvider>
                    <CalendariosProvider>
                      <AlunosProvider>
                        <Alunos />
                      </AlunosProvider>
                    </CalendariosProvider>
                  </TurmasProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'doacoes',
              element: (
                <EscolasProvider>
                  <TurmasProvider>
                    <AlunosProvider>
                      <CalendariosProvider>
                        <DoacoesProvider>
                          <Doacoes />
                        </DoacoesProvider>
                      </CalendariosProvider>
                    </AlunosProvider>
                  </TurmasProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'rankings',
              element: (
                <EscolasProvider>
                  <TurmasProvider>
                    <AlunosProvider>
                      <DoacoesProvider>
                        <Rankings />
                      </DoacoesProvider>
                    </AlunosProvider>
                  </TurmasProvider>
                </EscolasProvider>
              ),
            },
            {
              path: 'administrativo',
              element: (
                <UsuariosProvider>
                  <Administrativo />
                </UsuariosProvider>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}