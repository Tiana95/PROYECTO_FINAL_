let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
link.media = "all";
document.getElementsByTagName("head")[0].appendChild(link);

baseDeDatosLogin = JSON.parse(localStorage.getItem("sistema-de-login"));

let usuarioLogueado


if (!baseDeDatosLogin) {
  cargarDatosInicialesDeLaBaseDeDatosLogin();
}

function guardarDatosDeLaBaseDeDatosLogin() {
  localStorage.setItem("sistema-de-login", JSON.stringify(baseDeDatosLogin));
}

function cargarDatosInicialesDeLaBaseDeDatosLogin() {
  baseDeDatosLogin = {
    1234567890: {
      contraseña: "ghq",
      puntaje: 0,
    },
    "0987654321": {
      contraseña: "lid",
      puntaje: 0,
    },
    98765434567: {
      contraseña: "ugt",
      puntaje: 0,
    },
  };
}

async function menúBásico() {
  opción_menúBásico = -1;
  await swal.fire({
    title: "Si no tienes una cuenta Registrate Aquí.",
    showConfirmButton: false,
    html: `
        <button class="swal2-confirm swal2-styled" onclick='opción_menúBásico=0;Swal.close()'>
            Registrar cuenta
        </button>
        <br>
        <button class="swal2-confirm swal2-styled" onclick='opción_menúBásico=1;Swal.close()'>
            Iniciar Sesión
        </button>
        `,
  });
  switch (opción_menúBásico) {
    case 0:
      registrarNuevoUsuario();
      break;
    case 1:
      login();
      break;
    default:
      await menúBásico();
      break;
  }
}

async function mostrarUsuariosPorTabla(...propiedades) {
  if(!usuarioLogueado){
    return
  }
  let html = `
  <table class="table table-light table-striped">
    <theader>
    <th>
      Usuario
    </th>
  `;
  if (propiedades[0] == "*") {
    for (const usuario in baseDeDatosLogin) {
      for (const propiedad in baseDeDatosLogin[usuario]) {
        html += "<th>";
        html += propiedad;
        html += "</th>";
      }
      break;
    }
  } else {
    for (const propiedad of propiedades) {
      html += "<th>";
      html += propiedad;
      html += "</th>";
    }
  }
  html += "</theader><tbody>";
  for (const usuario in baseDeDatosLogin) {
    html += "<tr>";
    html += "<td>";
    html += usuario;
    html += "</td>";
    if (propiedades[0] == "*") {
      for (const propiedad in baseDeDatosLogin[usuario]) {
        html += "<td>";
        html += baseDeDatosLogin[usuario][propiedad];
        html += "</td>";
      }
    } else {
      for (const propiedad of propiedades) {
        html += "<td>";
        html += baseDeDatosLogin[usuario][propiedad];
        html += "</td>";
      }
    }

    html += "</tr>";
  }
  await swal.fire({
    text: "Usuarios",
    confirmButtonText: "Cerrar",
    html,
  });
}

async function registrarNuevoUsuario() {
  opción_registrarNuevoUsuario = -1;
  await swal.fire({
    title: "Registrar nueva cuenta",
    showConfirmButton: false,
    html: `
        <input class="swal2-input" placeholder="Ingrese su usuario" id="usuario">
        <input type="password" class="swal2-input" placeholder="Ingrese su contraseña" id="contraseña">
        <button class="swal2-confirm swal2-styled" onclick='opción_registrarNuevoUsuario=0;Swal.clickConfirm()'>
            Registrar
        </button>
        <button class="swal2-confirm swal2-styled" onclick='opción_registrarNuevoUsuario=1;Swal.close()'>
            Cancelar
        </button>
        `,
    preConfirm: () => {
      let usuario = document.getElementById("usuario").value;
      let contraseña = document.getElementById("contraseña").value;
      if (!usuario) {
        Swal.showValidationMessage("No hay usuario");
        return false;
      }
      if (!contraseña) {
        Swal.showValidationMessage("No hay contraseña");
        return false;
      }
      baseDeDatosLogin[usuario] = {};
      baseDeDatosLogin[usuario].contraseña = contraseña;
      baseDeDatosLogin[usuario].puntaje = 0;
      guardarDatosDeLaBaseDeDatosLogin();
      return true;
    },
  });
  switch (opción_registrarNuevoUsuario) {
    case 0:
      menúBásico();
      break;
    case 1:
      menúBásico();
      break;
    default:
      menúBásico();
      break;
  }
}

async function login() {
  await swal.fire({
    title: "Ingresa los datos solicitados",
    confirmButtonText: "Iniciar sesión",
    html: `
        <div style="margin:5px">
            <input class="swal2-input" placeholder="Ingrese su usuario" id="usuario">
            <input type="password" class="swal2-input" placeholder="Ingrese su contraseña" id="contraseña">
        </div>
        `,
    preConfirm: () => {
      let usuario = document.getElementById("usuario").value;
      let contraseña = document.getElementById("contraseña").value;
      if (!usuario) {
        Swal.showValidationMessage("Ingrese su usuario para iniciar sesión...");
        return false;
      }
      if (!contraseña) {
        Swal.showValidationMessage("Ingrese su contraseña para iniciar sesión...");
        return false;
      }
      let datos = baseDeDatosLogin[usuario];
      if (!datos) {
        Swal.showValidationMessage("El usuario ingresado no existe...");
        return false;
      }
      if (datos.contraseña != contraseña) {
        Swal.showValidationMessage("La contraseña ingresada no es la correcta...");
        return false;
      }
      usuarioLogueado = datos
      return true;
    },
  });
}
