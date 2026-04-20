import { useEscolas } from "./EscolasContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, School } from "lucide-react";
import ModalEscola from "./modal-escola";

const Escolas = () => {
  const { escolas, handleEdit, handleDelete } = useEscolas();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escolas</h1>
          <p className="text-gray-500 mt-1">Gerencie as escolas participantes</p>
        </div>
        <ModalEscola />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Escolas Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {escolas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma escola cadastrada</p>
              <p className="text-sm mt-2">Clique em "Nova Escola" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Diretor(a)</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escolas.map((escola) => (
                  <TableRow key={escola.id}>
                    <TableCell className="font-medium">{escola.nome}</TableCell>
                    <TableCell>{escola.municipio}</TableCell>
                    <TableCell>{escola.diretor || "--"}</TableCell>
                    <TableCell>{escola.contato || "--"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleEdit(escola);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(escola.id)}
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

export default Escolas;