import { useCalendarios } from "./CalendariosContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import ModalCalendario from "./modal-calendario";

const Calendario = () => {
  const { calendarios, handleEdit, handleDelete } = useCalendarios();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-500 mt-1">Gerencie os períodos de arrecadação</p>
        </div>
        <ModalCalendario />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calendarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum calendário cadastrado</p>
              <p className="text-sm mt-2">Clique em "Novo Calendário" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Término</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calendarios.map((calendario) => (
                  <TableRow key={calendario.id}>
                    <TableCell className="font-medium">{calendario.ano}</TableCell>
                    <TableCell>
                      {new Date(calendario.dataInicio).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {new Date(calendario.dataFim).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${calendario.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {calendario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(calendario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(calendario.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

      </Card>
    </div>
  );
}

export default Calendario;