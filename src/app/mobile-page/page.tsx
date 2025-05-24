"use client";

export default function MobileView() {
  return (
    <div style={{ padding: "20px", textAlign: "center" , display:"flex",justifyContent:"center",height:"100%",flexDirection:"column"}}>
      <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>
        Welcome to Mobile View 📱
      </h1>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        This page is designed for mobile users.
      </p>
      {/* <button
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#0070f3",
          color: "white",
        }}
      >
        Tap Me
      </button> */}
    </div>
  );
}
