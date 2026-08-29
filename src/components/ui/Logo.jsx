import { LOGO_CUENTAS_CLARAS } from "../../config/cloudinary";

const Logo = ({
  iconSize = 38,
  textSize = 24,
  mostrarTexto = true,
  color = "#f8fafc",
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img
          src={LOGO_CUENTAS_CLARAS}
          alt="Logo de Cuentas Claras"
          style={{
            width: `${iconSize * 1.65}px`,
            height: `${iconSize * 1.45}px`,
            maxWidth: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      
{mostrarTexto && (
  <span
    style={{
      fontWeight: 700,
      fontSize: `${textSize}px`,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ color: "#F8FAFC" }}>Cuentas </span>
    <span style={{ color: "#FACC15" }}>Claras</span>
  </span>
)}
    </div>
  );
};

export default Logo;