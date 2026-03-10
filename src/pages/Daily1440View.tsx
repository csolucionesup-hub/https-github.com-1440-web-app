import React from "react";
import Card from "../components/ui/Card";
import DashboardMetrics from "../components/ui/DashboardMetrics";

export default function Daily1440View() {

  const freeMinutes = 780;
  const plannedMinutes = 420;
  const executedMinutes = 185;
  const alignmentPercent = 54;

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(79,70,229,0.18), transparent 22%), #0B1220",
        padding: 24,
        color: "#F8FAFC"
      }}
    >

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto"
        }}
      >

        <div style={{ marginBottom: 24 }}>

          <div
            style={{
              fontSize: 14,
              color: "#94A3B8",
              marginBottom: 8,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            1440 minutos de tu vida
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 36,
              lineHeight: 1.1,
              fontWeight: 800
            }}
          >
            Administra tus minutos para construir tus metas
          </h1>

          <p
            style={{
              marginTop: 12,
              maxWidth: 760,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#CBD5E1"
            }}
          >
            Cada día tiene 1440 minutos. Esta aplicación te ayuda a ver
            cuántos minutos estás invirtiendo realmente en las metas
            que quieres construir.
          </p>

        </div>


        <DashboardMetrics
          freeMinutes={freeMinutes}
          plannedMinutes={plannedMinutes}
          executedMinutes={executedMinutes}
          alignmentPercent={alignmentPercent}
        />



        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 16,
            marginBottom: 24
          }}
        >

          <Card
            title="Distribución del día"
            subtitle="Cómo se está usando tu tiempo hoy"
          >

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12
              }}
            >

              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 14,
                  padding: 16
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 13 }}>
                  Sueño
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  8 h
                </div>
              </div>


              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 14,
                  padding: 16
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 13 }}>
                  Rutina fija
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  3 h
                </div>
              </div>



              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 14,
                  padding: 16
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 13 }}>
                  Tiempo para metas
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  7 h
                </div>
              </div>

            </div>

          </Card>



          <Card
            title="Progreso del día"
            subtitle="Qué tan alineado estás con tus metas"
          >

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>Progreso diario</span>
                <strong>44%</strong>
              </div>


              <div
                style={{
                  width: "100%",
                  height: 12,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden"
                }}
              >

                <div
                  style={{
                    width: "44%",
                    height: "100%",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg,#4F46E5,#06B6D4)"
                  }}
                />

              </div>


              <div
                style={{
                  fontSize: 14,
                  color: "#94A3B8"
                }}
              >
                Todavía tienes margen para dirigir más minutos hacia
                tus metas principales.
              </div>

            </div>

          </Card>

        </div>



      </div>

    </div>

  );

}
