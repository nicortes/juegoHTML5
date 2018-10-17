/// OBJETOS

// Jugador
var jugador;

// Enemigos

// Se crea el arreglo que contiene los enemigos
var listaEnemigos = {};
var listaMejoras = {};
var listaBalas = {};

/// FUNCIONES (si no es una variable, no importa dónde se definan)

// Crea el objeto jugador
Jugador = function(){
  var self = Actor('jugador','myID','jugador',ancho_lienzo/2,alto_lienzo/2,20,20,50,50,Img.jugador,1,51,salud_jugador);
   // Puede disparar desde el principio (tiempo_entre_balas = 51)

   // Como el jugador es controlado manual, reemplazo la función de movimiento
   self.actualizarPosicion = function(){
     if(self.pressingLeft){
       self.x -= 10;
     }
     if(self.pressingRight){
       self.x += 10;
     }
     if(self.pressingDown){
       self.y += 10;
     }
     if(self.pressingUp){
       self.y -= 10;
     }

     var mitad_ancho_jugador = self.ancho/2;
     var mitad_alto_jugador = self.alto/2;

     // Para que no se salga del lienzo
     if(self.x < mitad_ancho_jugador){
       self.x = mitad_ancho_jugador;
     }
     if(self.x > ancho_lienzo - mitad_ancho_jugador){
       self.x = ancho_lienzo - mitad_ancho_jugador;
     }
     if(self.y < mitad_alto_jugador){
       self.y = mitad_alto_jugador;
     }
     if(self.y > alto_lienzo - mitad_alto_jugador){
       self.y = alto_lienzo - mitad_alto_jugador;
     }
   }

  // Movimiento
  self.pressingLeft = false;
  self.pressingRight = false;
  self.pressingDown = false;
  self.pressingUp = false;

  //jugador = self;
  return self;
}

// Crea el objeto enemigo y lo agrega a la lista
Enemigo = function (id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2,angulo_disparo2,vel_disparo2,tiempo_entre_balas2,salud2){
  var self = Actor('enemigo',id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2,vel_disparo2,tiempo_entre_balas2,salud2);

  listaEnemigos[self.id] = self;
}

// Crea un actor, jugador o enemigo
Actor = function(tipo2,id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2,vel_disparo2,tiempo_entre_balas2,salud2){
  var self = crearEntidad(tipo2,id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2);

  self.salud = salud2;
  self.vel_disparo = vel_disparo2;
  self.tiempo_entre_balas = tiempo_entre_balas2;
  self.angulo_disparo = 0;

  var actualizacion_guardada = self.actualizar; // Guardamos la función actualizar en una variable
  self.actualizar = function(){ // Sobreescribimos la función actualizar
    actualizacion_guardada(); // Ejecutamos la función que guardamos antes de sobreescribirla
    self.tiempo_entre_balas += self.vel_disparo; // NO ESTOY SEGURO DE ESTO, EN LA FUNCION dispario() YA FUNCIONA, INCLUSO SI EL tiempo_entre_balas es aumentado sólo en 1 en esta parte
  }

  self.disparar = function(){
    //console.log(jugador.tiempo_entre_balas);
    if(self.tiempo_entre_balas > 25/self.vel_disparo){ // Empieza disparando cada segundo (porque vel_disparo=1), pero con cada mejora se hace más frecuente
      generarBala(self); // Se dispara una bala
      self.tiempo_entre_balas = 0;
    }
  }

  self.disparar_especial = function(){
    if(self.tiempo_entre_balas > 50){ // Si no dispara por 2 segundos
      /*
      generarBala(jugador,0); // Derecha
      generarBala(jugador,Math.PI/4); // Diagonal superior derecha
      generarBala(jugador,Math.PI/2); // Arriba
      generarBala(jugador,3*Math.PI/4); // Diagonal superior izquierda
      generarBala(jugador,Math.PI); // Izquierda
      generarBala(jugador,-3*Math.PI/4); // Diagonal inferior izquierda
      generarBala(jugador,-Math.PI/2); // Abajo
      generarBala(jugador,-Math.PI/4); // Diagonal inferior derecha
      */
      for(var angle = -3*Math.PI/4; angle <= Math.PI; angle += Math.PI/4 ){ // Dispara balas en 8 direcciones, desde -3*pi/4 hasta pi
        generarBala(self,angle);
      }
      self.tiempo_entre_balas = 0;
    }
  }

  return self;
}

crearEnemigoAleatorio = function(){
  var id = Math.random(); // NO ME CONVENCE, SI SALE UN NÚMERO ALEATORIO QUE YA FUE INGRESADO, SE SOBREESCRIBIRÁ EL ENEMIGO
  var nombre = id;
  var x;
  do{ // REVISAR ESTO, SE ESTÁN GENERANDO ENEMIGOS FUERA DEL LIENZO
    x = Math.random() * ancho_lienzo; //Math.random retorna un número entre 0 y 1
  }while( (x < jugador.x + jugador.ancho*2) && (x > jugador.x - jugador.ancho*2) ); // El enemigo no puede ser creado cerca del jugador
  var y;
  do{
    y = Math.random() * ancho_lienzo;
  }while( (y < jugador.y + jugador.alto*2) && (y > jugador.y - jugador.alto*2) );
  var alto = 20 + Math.random() * 30; // Alto entre 20 y 50
  var ancho = 20 + Math.random() * 30; // Ancho entre 20 y 50
  var velx = 5 + Math.random() * 5; // Velocidad entre 5 y 10
  var vely = 5 + Math.random() * 5; // Velocidad entre 5 y 10
  var color; // Parte por defecto como un rectángulo blanco (invisible)
  /*
  do{
    color = getRandomColor();
    // Se genera un color aleatorio. No puede repetirse el del jugador, el de las mejoras o el de las balas. Tampoco puede ser blanco (invisible)
  }while(color == '#BF00FF' || color == '#000000' || color == '#FF8000' || color == '#FFFFFF' || color == color_jugador);
  */
  var num_enemigo = Math.random();
  var imagen;
  if(num_enemigo < 0.3){
    imagen = Img.enemigo1;
  }else if(num_enemigo > 0.6){
    imagen = Img.enemigo3;
  }else{
    imagen = Img.enemigo2;
  }

  var angulo_disparo = 0;
  var vel_disparo = 1;
  var tiempo_entre_balas = 0;
  var salud = 1;

  Enemigo(id,nombre,x,y,velx,vely,ancho,alto,imagen,angulo_disparo,vel_disparo,tiempo_entre_balas,salud);
}

crearMejora = function (id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2,categoria2){
  var self = crearEntidad('mejora',id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2);

  self.categoria = categoria2;

  listaMejoras[self.id] = self;
}

crearMejoraAleatoria = function(){
  var id = Math.random(); // NO ME CONVENCE, SI SALE UN NÚMERO ALEATORIO QUE YA FUE INGRESADO, SE SOBREESCRIBIRÁ EL ENEMIGO
  var nombre = id;
  var x = Math.random() * ancho_lienzo; //Math.random retorna un número entre 0 y 1
  var y = Math.random() * alto_lienzo; //Math.random retorna un número entre 0 y 1
  var alto = 30; // Las mejoras miden 10 de alto
  var ancho = 30; // Las mejoras miden 10 de ancho
  var velx = 0; // Las mejoras no se mueven
  var vely = 0; // Las mejoras no se mueven
  var color;
  var imagen;
  var categoria;
  if(Math.random() < 0.7){ // 70% de probabilidad de que aumente el puntaje
    //color = '#FF8000'; // Las mejoras de puntaje son de color naranjo
    imagen = Img.mejora_puntos;
    categoria = 'puntos';
  }else{
    //color = '#BF00FF'; // las mejoras de bala son de color lila
    imagen = Img.mejora_bala;
    categoria = 'bala'
  }

  crearMejora(id,nombre,x,y,velx,vely,ancho,alto,imagen,categoria);
}

crearBala = function (id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2){
  var self = crearEntidad('bala',id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,/*'#000000'*/Img.bala_jugador);
  // Las balas son de color negro

  self.tiempo_de_vida = 0;

  listaBalas[self.id] = self;
}

generarBala = function(entidad,angulo_reemplazo){
  var id = Math.random(); // NO ME CONVENCE, SI SALE UN NÚMERO ALEATORIO QUE YA FUE INGRESADO, SE SOBREESCRIBIRÁ EL ENEMIGO
  var nombre = id;
  var x = entidad.x;
  var y = entidad.y;
  var alto = 20;
  var ancho = 20;
  var angulo = entidad.angulo_disparo; // Se dispara en la dirección del mouse
  if(angulo_reemplazo !== undefined){ // Si se especifica un nuevo ángulo, se usa ese
    angulo = angulo_reemplazo;
  }
  var velx = Math.cos(angulo)*10; // Se dispara con una velocidad entre 0 y 10
  var vely = Math.sin(angulo)*10; // Se dispara con una velocidad entre 0 y 10

  crearBala(id,nombre,x,y,velx,vely,ancho,alto);
}

crearEntidad = function(tipo2,id2,nombre2,x2,y2,velx2,vely2,ancho2,alto2,imagen2){
  var self = {
    tipo: tipo2,
    id: id2,
    nombre: nombre2,
    x: x2,
    y: y2,
    velx: velx2,
    vely: vely2,
    ancho: ancho2,
    alto: alto2,
    //color: color2, // Esto ya no lo voy a usar, pero igual lo dejo
    imagen: imagen2
  };
  /// Funciones dentro de la función: Pueden usar las variables locales de la función 'exterior'

  // Actualizar posición en el lienzo
  self.actualizar = function(){
    self.actualizarPosicion();
    self.dibujar();
  }

  // Actualiza los valores de x e y de una entidad
  self.actualizarPosicion = function(){
    self.x += self.velx;
    self.y += self.vely;

    if(self.x > ancho_lienzo || self.x < 0){
      self.velx *= -1;
    }
    if(self.y > alto_lienzo || self.y < 0){
      self.vely *= -1;
    }
  }

  // Crea la entidad en el lienzo
  self.dibujar = function(){
    ctx.save(); // Guarda la información del lienzo (color, fuente, etc.)
    var origen_x = self.x - self.ancho/2; // El origen quedaría en la esquina superior izquierda, por eso se "mueve" hacia la derecha hasta llegar al centro (la mitad de su ancho)
    var origen_y = self.y - self.alto/2; // Lo mismo, se mueve el origen hacia abajo para llegar al centro (mitad del alto)
    ctx.drawImage(self.imagen,origen_x,origen_y,self.ancho,self.alto);

    //ctx.drawImage(self.imagen,0,0,self.imagen.width,self.imagen.height,origen_x,origen_y,self.width,self.height);

    /*
    ctx.fillStyle = self.color; // Cambio el color por un momento para dibujar al jugador
    ctx.fillRect(origen_x,origen_y,self.ancho,self.alto); // Se dibuja un rectángulo de ancho x alto
    */
    ctx.restore(); // Restaura la información del lienzo que quedó guardada
  }

  // Verifica si chocan dos rectángulos
  self.areRectanglesColliding = function(rect2){
    // Centramos el origen del rectángulo
    var x1 = self.x - self.ancho/2;
    var y1 = self.y - self.alto/2;
    var x2 = rect2.x - rect2.ancho/2;
    var y2 = rect2.y - rect2.alto/2;
    return x1 <= x2 + rect2.ancho
    && y1 <= y2 + rect2.alto
    && x2 <= x1 + self.ancho
    && y2 <= y1 + self.alto
  }

  // Retorna la distancia entre dos entidades
  self.getDistanceBetweenEntities = function(entity2){
    var dif_x = self.x - entity2.x;
    var dif_y = self.y - entity2.y;
    return Math.sqrt(dif_x*dif_x + dif_y*dif_y);
  }

  // Retorna true si la distancia entre dos entidades es menor a cierto valor
  self.isColliding = function(entity2){
    var distancia = getDistanceBetweenEntities(self,entity2);
    return distancia < 30;
  }

  return self;
}
