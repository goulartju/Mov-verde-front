import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from '../components/layout'

export const Routes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, element: <div>Hello World</div> },
        // { path: 'cadastro-calendario', element: <CadastroCalendario /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}