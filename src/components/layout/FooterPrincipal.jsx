import Logo from "../ui/Logo";

const FooterPrincipal = () => {
  return (
    <footer
      className="footer-principal"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#9ca3af",
          fontSize: "12px",
        }}
      >
        <Logo iconSize={18} textSize={16} />

        <span>© 2026 · Tus gastos, bajo control</span>
      </div>
    </footer>
  );
};

export default FooterPrincipal;