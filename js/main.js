var turno = "X";
var movidas = 0;
var casillas = [];

$( document ).ready(function() {
	mostrarTurnoActual();
	prepararTablero();
});

function mostrarTurnoActual(){
	$('#turno').text(turno);
}

function prepararTablero(){
	var tablero = document.getElementById("tablero"),
		i, j,
		fila, celda;

	tablero.border = 1;

	for (i = 0; i < 3; i += 1) {
		fila = document.createElement("tr");
		tablero.appendChild(fila);
		for (j = 0; j < 3; j += 1) {
			celda = document.createElement("td");
			celda.align = celda.valign = 'center';
			celda.onclick = jugar;
			celda.appendChild(document.createTextNode(""));
			fila.appendChild(celda);
			casillas.push(celda);
		}
	}
	juegoNuevo();
}

function jugar(jugada) {
	// Si ya se jugó en la casilla, no hay nada más que hacer
	var casilla = this;
	if ($.isNumeric(jugada)){
		casilla = casillas[jugada];
	}
	if (casilla.firstChild.nodeValue !== "") {
		if (jugada !== undefined){
			alert("Se devolvió una casilla ya ocupada: "+(jugada));
		}
		return;
	}
	// Marcar la casilla con el símbolo del turno actual
	casilla.firstChild.nodeValue = turno;
	movidas += 1;
	if (existeGanador()){
		alert(turno + " ganó!");
		juegoNuevo();
	}else if (movidas === 9) {
		// Ya se jugaron todas las casillas y no hubo ganador
		alert("Empate!");
		juegoNuevo();
	} else {
		// Cambiar el símbolo del turno al siguiente jugador
		cambiarTurno();
	}
	mostrarTurnoActual();
}

function cambiarTurno(){
	turno = turno === "X" ? "O" : "X";
}

function existeGanador(){
	var valores = [];
	for (var i=0; i<9; i++){
		valores.push(casillas[i].firstChild.nodeValue);
	}
	var combinacionesGanadoras = [
					[0,1,2]
					,[3,4,5]
					,[6,7,8]
					,[0,3,6]
					,[1,4,7]
					,[2,5,8]
					,[0,4,8]
					,[2,4,6]
				];
	var tateti;
	for (var i = 0; i < combinacionesGanadoras.length; i++){
		tateti = combinacionesGanadoras[i];
		for (var j=0; j<tateti.length; j++){
			if (valores[tateti[0]] !== "" 
						&& valores[tateti[0]] === valores[tateti[1]] 
						&& valores[tateti[0]] === valores[tateti[2]]){
				return true;
			}
		}
	}
	return false;
}

function juegoNuevo(){
	var i;

	turno = "X";
	movidas = 0;
	for (i = 0; i < 9; i += 1) {
	    casillas[i].firstChild.nodeValue = "";
	}

}

function obtenerJugada(){
	var valores = [];
	for (var i=0; i<9; i++){
		valores.push(casillas[i].firstChild.nodeValue);
	}
	var tablero = JSON.stringify(valores);
	var request;
    var params = {tablero: tablero};
    request = $.ajax({
        url:"http://localhost/obtenerJugada.php"
        , type: "post"
        , data: params
        , success: function(response){
            jugar(response);
        }
        , error: function(jqXHR, textStatus, errorThrown){
            alert("Ocurrió un error procesando la solicitud: "+textStatus);
            console.log(textStatus, errorThrown);
        }
    });
}
