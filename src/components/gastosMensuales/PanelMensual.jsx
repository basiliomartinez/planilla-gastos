import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FormularioGasto from "../FormularioGasto";
import ListaGastos from "../ListaGastos";

const PanelMensual = ({
  gastosPendientes,
  gastosPagados,
  agregarGasto,
  editarGasto,
  marcarComoPagado,
  eliminarPagado,
  totalPendiente,
  periodoActivo,
  setPeriodoActivo,
  moverMensualAFuturo,
  usuario,
}) => {
  const [gastoEditando, setGastoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cancelarEdicion = () => {
    setGastoEditando(null);
  };

  const filtrarGastos = (arrayGastos) =>
    arrayGastos.filter((gasto) =>
      gasto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );

  const gastosPendientesFiltrados = filtrarGastos(gastosPendientes);
  const gastosPagadosFiltrados = filtrarGastos(gastosPagados);

  const nombrePeriodo = new Date(`${periodoActivo}-02`).toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    },
  );

  const exportarPDF = () => {
    const doc = new jsPDF();

    const periodoFormateado =
      nombrePeriodo.charAt(0).toUpperCase() + nombrePeriodo.slice(1);

    const totalPagado = gastosPagados.reduce(
      (acc, gasto) => acc + gasto.monto,
      0,
    );

    doc.setFillColor(11, 19, 43);
    doc.rect(0, 0, 210, 34, "F");

    doc.setTextColor(250, 204, 21);
    doc.setFontSize(18);
    doc.text("Cuentas Claras", 14, 15);

    doc.setTextColor(229, 231, 235);
    doc.setFontSize(11);
    doc.text("Resumen mensual de gastos", 14, 24);

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.text(`Usuario: ${usuario?.nombre || "Sin usuario"}`, 14, 44);
    doc.text(`Período: ${periodoFormateado}`, 14, 51);
    doc.text(`Emitido: ${new Date().toLocaleDateString("es-AR")}`, 14, 58);

    doc.text(
      `Total pendiente: $${totalPendiente.toLocaleString("es-AR")}`,
      14,
      70,
    );
    doc.text(`Total pagado: $${totalPagado.toLocaleString("es-AR")}`, 14, 77);
    autoTable(doc, {
      startY: 88,
      head: [["Pendientes", "Vencimiento", "Monto"]],
      body: gastosPendientes.map((gasto) => [
        gasto.nombre,
        gasto.vencimiento?.split("T")[0] || gasto.vencimiento,
        `$${gasto.monto.toLocaleString("es-AR")}`,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Pagados", "Fecha pago", "Monto"]],
      body: gastosPagados.map((gasto) => [
        gasto.nombre,
        gasto.fechaPago?.split("T")[0] || gasto.fechaPago || "-",
        `$${gasto.monto.toLocaleString("es-AR")}`,
      ]),
    });
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Reporte generado automáticamente por Cuentas Claras.", 14, 287);
    doc.save(`gastos-${periodoActivo}.pdf`);
  };

  return (
    <>
      <div className="calc-display">
        <p className="calc-title">
          {nombrePeriodo.charAt(0).toUpperCase() + nombrePeriodo.slice(1)}
        </p>

        <p className="calc-amount">${totalPendiente.toLocaleString("es-AR")}</p>

        <div className="calc-sub">
          {gastosPendientes.length} gasto(s) pendientes
        </div>

        <div className="selector-periodo-contenedor mt-3">
          <Form.Select
            className="selector-periodo"
            value={periodoActivo.split("-")[1]}
            onChange={(e) => {
              const nuevoMes = e.target.value;
              const anio = periodoActivo.split("-")[0];

              setPeriodoActivo(`${anio}-${nuevoMes}`);
            }}
          >
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </Form.Select>

          <Form.Select
            className="selector-periodo"
            value={periodoActivo.split("-")[0]}
            onChange={(e) => {
              const nuevoAnio = e.target.value;
              const mes = periodoActivo.split("-")[1];

              setPeriodoActivo(`${nuevoAnio}-${mes}`);
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const anio = 1980 + i;

              return (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              );
            })}
          </Form.Select>
        </div>
      </div>

      <div className="calc-body">
        <div className="formulario-header">
          <h2 className="h4 mb-0">
            {gastoEditando ? "Editar gasto" : "Agregar gasto"}
          </h2>

          <Button
            variant="outline-light"
            size="sm"
            className="btn-exportar-pdf-desktop"
            onClick={exportarPDF}
          >
            📄 Exportar PDF
          </Button>
        </div>

        <FormularioGasto
          agregarGasto={agregarGasto}
          editarGasto={editarGasto}
          gastoEditando={gastoEditando}
          cancelarEdicion={cancelarEdicion}
          ocultarTitulo
        />

        <section className="mb-4">
          <h2 className="section-title">Buscar gasto</h2>

          <Form.Control
            type="text"
            className="buscador-gastos"
            placeholder="🔎 Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </section>

        <h2 className="section-title">Pendientes</h2>
        <div className="list-soft">
          <ListaGastos
            titulo={null}
            arrayGastos={gastosPendientesFiltrados}
            tipo="pendiente"
            onAccion={marcarComoPagado}
            onEditar={setGastoEditando}
            periodoActivo={periodoActivo}
            onMoverAFuturo={moverMensualAFuturo}
          />
        </div>

        <div className="paid-block">
          <h2 className="section-title">Pagados</h2>
          <div className="list-soft">
            <ListaGastos
              titulo={null}
              arrayGastos={gastosPagadosFiltrados}
              tipo="pagado"
              onAccion={eliminarPagado}
            />
          </div>
        </div>

        <div className="exportar-pdf-mobile">
          <Button
            variant="outline-light"
            className="w-100"
            onClick={exportarPDF}
          >
            📄 Exportar PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default PanelMensual;
