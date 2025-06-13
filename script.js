const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYBWDNA_hwSRmgn9NJp0lE_W_Bv2PrxVYP8t4_fyPXNd0c9QHqlCJnURXVw4OIXw/pub?output=csv';


let datos = [];

function cargarDatosDesdeGoogleSheet() {
  fetch(sheetURL)
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split('\n').slice(1);
      datos = rows.map(row => {
        const [nombre, rate, fsaf, cantidad, horas,DPMO,Semana,Fecha] = row.split(',');
        return { nombre, rate, fsaf, cantidad, horas,DPMO,Semana,Fecha };
      });
      mostrarDatos();
    });
}

function mostrarDatos() {
  const contenedorTabla = document.getElementById("skillTable");
  const contenedorCards = document.getElementById("cardsContainer");
  contenedorTabla.innerHTML = "";
  contenedorCards.innerHTML = "";

  const filtroEmpleado = document.getElementById("filtroEmpleado").value.toLowerCase();
  const filtroHabilidad = document.getElementById("filtroHabilidad").value;

  const filtrados = datos.filter(d =>
    d.nombre.toLowerCase().includes(filtroEmpleado) &&
    (!filtroHabilidad || d[filtroHabilidad.toLowerCase()])
  );

  filtrados.forEach(dato => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${dato.nombre}</td>
      <td>${dato.rate}</td>
      <td>${dato.fsaf}</td>
      <td>${dato.cantidad}</td>
      <td>${dato.horas}</td>
      <td>${dato.DPMO}</td>
      <td>${dato.Semana}</td>
      <td>${dato.Fecha}</td>
    `;
    contenedorTabla.appendChild(fila);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${dato.nombre}</h3>
      <p>Rate: ${dato.rate}</p>
      <p>Fsaf: ${dato.fsaf}</p>
      <p>Cantidad: ${dato.cantidad}</p>
      <p>Horas: ${dato.horas}</p>
      <p>DPMO: ${dato.DPMO}</p>
      <p>DPMO: ${dato.Semana}</p>
      <p>DPMO: ${dato.Fecha}</p>
    `;
    contenedorCards.appendChild(card);
  });

  if (window.innerWidth < 768) {
    document.getElementById("vistaEscritorio").style.display = "none";
    document.getElementById("vistaMovil").style.display = "block";
  } else {
    document.getElementById("vistaEscritorio").style.display = "block";
    document.getElementById("vistaMovil").style.display = "none";
  }
}

document.getElementById("filtroEmpleado").addEventListener("input", mostrarDatos);
document.getElementById("filtroHabilidad").addEventListener("change", mostrarDatos);

function descargarExcel() {
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Habilidades");
  XLSX.writeFile(wb, "Resumen_Rendimientos.xlsx");
}
