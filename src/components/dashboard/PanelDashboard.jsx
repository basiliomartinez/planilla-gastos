import { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORES_DASHBOARD = {
  Pendiente: "#dc3545",
  Pagado: "#198754",
  Futuros: "#ff9800",
  Cuotas: "#0d6efd",
};

const formatearMillones = (value) => {
  if (value === 0) return "0";

  return `${Number(value / 1000000).toLocaleString("es-AR", {
    maximumFractionDigits: 1,
  })}M`;
};

const tooltipStyle = {
  backgroundColor: "#020617",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "10px",
  color: "#f8fafc",
};

const PanelDashboard = ({
  totalPendiente,
  totalPagados,
  totalFuturos,
  deudaCuotas,
  periodoActivo,
  setPeriodoActivo,
  setSeccionActiva,
  usuario,
}) => {
  const dashboardRef = useRef(null);

  const nombrePeriodo = new Date(`${periodoActivo}-02`).toLocaleDateString(
    "es-AR",
    { month: "long", year: "numeric" }
  );

  const periodoFormateado =
    nombrePeriodo.charAt(0).toUpperCase() + nombrePeriodo.slice(1);

  const dataBarras = [
    {
      nombre: "Pendiente",
      monto: totalPendiente,
      fill: COLORES_DASHBOARD.Pendiente,
      seccion: "mensuales",
    },
    {
      nombre: "Pagado",
      monto: totalPagados,
      fill: COLORES_DASHBOARD.Pagado,
      seccion: "historial",
    },
    {
      nombre: "Futuros",
      monto: totalFuturos,
      fill: COLORES_DASHBOARD.Futuros,
      seccion: "futuros",
    },
    {
      nombre: "Cuotas",
      monto: deudaCuotas,
      fill: COLORES_DASHBOARD.Cuotas,
      seccion: "cuotas",
    },
  ];

  const dataTorta = [
    { nombre: "Pendiente", value: totalPendiente },
    { nombre: "Pagado", value: totalPagados },
    { nombre: "Futuros", value: totalFuturos },
    { nombre: "Cuotas", value: deudaCuotas },
  ].filter((item) => item.value > 0);

  const porcentajePagado =
    totalPendiente + totalPagados > 0
      ? Math.round((totalPagados / (totalPendiente + totalPagados)) * 100)
      : 0;

  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(11, 19, 43);
    doc.rect(0, 0, 210, 34, "F");

    doc.setTextColor(250, 204, 21);
    doc.setFontSize(18);
    doc.text("Cuentas Claras", 14, 15);

    doc.setTextColor(229, 231, 235);
    doc.setFontSize(11);
    doc.text("Dashboard de gastos", 14, 24);

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.text(`Usuario: ${usuario?.nombre || "Sin usuario"}`, 14, 44);
    doc.text(`Periodo: ${periodoFormateado}`, 14, 51);
    doc.text(`Emitido: ${new Date().toLocaleDateString("es-AR")}`, 14, 58);

    if (dashboardRef.current) {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: "#0b132b",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 182;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 14, 66, imgWidth, Math.min(imgHeight, 92));
    }

    autoTable(doc, {
      startY: 165,
      head: [["Concepto", "Monto"]],
      body: [
        ["Pendiente", `$${totalPendiente.toLocaleString("es-AR")}`],
        ["Pagado", `$${totalPagados.toLocaleString("es-AR")}`],
        ["Futuros", `$${totalFuturos.toLocaleString("es-AR")}`],
        ["Cuotas", `$${deudaCuotas.toLocaleString("es-AR")}`],
        ["Pagado del mes", `${porcentajePagado}%`],
        [
          "Total mensual",
          `$${(totalPendiente + totalPagados).toLocaleString("es-AR")}`,
        ],
        [
          "Compromisos futuros",
          `$${(totalFuturos + deudaCuotas).toLocaleString("es-AR")}`,
        ],
      ],
      headStyles: {
        fillColor: [11, 19, 43],
        textColor: [250, 204, 21],
      },
      styles: {
        fontSize: 10,
      },
    });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Reporte generado automáticamente por Cuentas Claras.",
      14,
      287
    );

    doc.save(`dashboard-${periodoActivo}.pdf`);
  };

  return (
    <>
      <div className="calc-display">
        <div className="dashboard-header">
          <div>
            <p className="calc-title">Dashboard</p>
            <div className="calc-sub">Resumen visual · {periodoFormateado}</div>
          </div>

          <Button
            variant="outline-light"
            size="sm"
            className="btn-dashboard-pdf-desktop"
            onClick={exportarPDF}
          >
            📄 Exportar PDF
          </Button>
        </div>

        <div className="selector-periodo-contenedor mt-3">
          <Form.Select
            className="selector-periodo"
            value={periodoActivo.split("-")[1]}
            onChange={(e) => {
              const anio = periodoActivo.split("-")[0];
              setPeriodoActivo(`${anio}-${e.target.value}`);
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
              const mes = periodoActivo.split("-")[1];
              setPeriodoActivo(`${e.target.value}-${mes}`);
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
        <div ref={dashboardRef}>
          <section className="dashboard-grid">
            <div className="dashboard-card">
              <h2 className="section-title">Distribución de gastos</h2>

              <div className="dashboard-chart">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dataBarras} margin={{ left: 12 }}>
                    <XAxis
                      dataKey="nombre"
                      stroke="#cbd5e1"
                      interval={0}
                      tickMargin={10}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#cbd5e1"
                      tickFormatter={formatearMillones}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "#facc15" }}
                      cursor={false}
                      formatter={(value) =>
                        `$${Number(value).toLocaleString("es-AR")}`
                      }
                    />
                    <Bar
                      dataKey="monto"
                      radius={[8, 8, 0, 0]}
                      cursor="pointer"
                      isAnimationActive
                      animationDuration={900}
                      onClick={(data) => setSeccionActiva(data.seccion)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="section-title">Composición</h2>

              {dataTorta.length === 0 ? (
                <p className="dashboard-empty">
                  No hay datos para graficar todavía.
                </p>
              ) : (
                <div className="dashboard-chart dashboard-chart-pie">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={dataTorta}
                        dataKey="value"
                        nameKey="nombre"
                        outerRadius={80}
                        label={false}
                        stroke="#0b132b"
                        strokeWidth={2}
                        isAnimationActive
                        animationDuration={900}
                      >
                        {dataTorta.map((item) => (
                          <Cell
                            key={`cell-${item.nombre}`}
                            fill={COLORES_DASHBOARD[item.nombre]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: "#facc15" }}
                        formatter={(value) =>
                          `$${Number(value).toLocaleString("es-AR")}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="dashboard-legend">
                    {dataTorta.map((item) => (
                      <div key={item.nombre} className="dashboard-legend-item">
                        <span
                          className="dashboard-legend-color"
                          style={{
                            backgroundColor: COLORES_DASHBOARD[item.nombre],
                          }}
                        />
                        {item.nombre}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-kpis">
            <div className="dashboard-kpi">
              <span>Pagado del mes</span>
              <strong>{porcentajePagado}%</strong>
            </div>

            <div className="dashboard-kpi">
              <span>Total mensual</span>
              <strong>
                ${(totalPendiente + totalPagados).toLocaleString("es-AR")}
              </strong>
            </div>

            <div className="dashboard-kpi">
              <span>Compromisos futuros</span>
              <strong>
                ${(totalFuturos + deudaCuotas).toLocaleString("es-AR")}
              </strong>
            </div>
          </section>
        </div>

        <div className="dashboard-pdf-mobile">
          <Button variant="outline-light" onClick={exportarPDF}>
            📄 Exportar PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default PanelDashboard;