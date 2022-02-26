const { getArtistStripe, getDataArtist } = require("../services-mysql/artists");
const { getFiveArtistsCollections } = require("../services-mysql/colletions");
const { getLastArtistEvent, getAllEvents } = require("../services-mysql/events");
const {
  getObraBySoldDate,
  getObrasWeekly,
  getObrasMothly,
  getArtistObrasSold,
} = require("../services-mysql/obras");
const { getUserName } = require("../services-mysql/users");

var dashboardStats = async (data) => {
  const artista = true;
  const logueado = true;
  const dashboard = true;

  const artistStripe = await getArtistStripe(data.user.id);
  var stripeRegistro = false;
  if (artistStripe.length > 0) {
    stripeRegistro = true;
  }

  const date = new Date();
  var hoy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  var sieteDias = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 7
  );
  var treintaDias = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 30
  );
  var diaSemana = hoy.getDay();

  //----------------OBRAS--------------------//

  var ventasSemana = 0;
  var ventasMes = 0;
  var estaSemana = {
    ventalunes: 0,
    ventamartes: 0,
    ventamiercoles: 0,
    ventajueves: 0,
    ventaviernes: 0,
    ventasabado: 0,
    ventadomingo: 0,
  };

  var semanaPasada = {
    ventalunes0: 0,
    ventamartes0: 0,
    ventamiercoles0: 0,
    ventajueves0: 0,
    ventaviernes0: 0,
    ventasabado0: 0,
    ventadomingo0: 0,
  };

  if (diaSemana == 0) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const domingo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 13
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 12
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 11
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 10
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 9
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }

  if (diaSemana == 1) {
    const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 2
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 3
    );
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 4
    );
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 5
    );
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 6
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }

  if (diaSemana == 2) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const martes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 2
    );
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 3
    );
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 4
    );
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 5
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }

  if (diaSemana == 3) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 2
    );
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 3
    );
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 4
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 9
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }
  if (diaSemana == 4) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const jueves = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 2
    );
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 3
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 10
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 9
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }

  if (diaSemana == 5) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const viernes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const sabado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 2
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 11
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 10
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 9
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }

  if (diaSemana == 6) {
    const lunes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 5
    );
    const martes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 4
    );
    const miercoles = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 3
    );
    const jueves = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 2
    );
    const viernes = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 1
    );
    const sabado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const domingo = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );

    const lunes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 12
    );
    const martes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 11
    );
    const miercoles0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 10
    );
    const jueves0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 9
    );
    const viernes0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 8
    );
    const sabado0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 7
    );
    const domingo0 = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 6
    );

    const ventalunes = await getObraBySoldDate(data.user.id, lunes);
    const ventamartes = await getObraBySoldDate(data.user.id, martes);
    const ventamiercoles = await getObraBySoldDate(data.user.id, miercoles);
    const ventajueves = await getObraBySoldDate(data.user.id, jueves);
    const ventaviernes = await getObraBySoldDate(data.user.id, viernes);
    const ventasabado = await getObraBySoldDate(data.user.id, sabado);
    const ventadomingo = await getObraBySoldDate(data.user.id, domingo);

    const ventalunes0 = await getObraBySoldDate(data.user.id, lunes0);
    const ventamartes0 = await getObraBySoldDate(data.user.id, martes0);
    const ventamiercoles0 = await getObraBySoldDate(data.user.id, miercoles0);
    const ventajueves0 = await getObraBySoldDate(data.user.id, jueves0);
    const ventaviernes0 = await getObraBySoldDate(data.user.id, viernes0);
    const ventasabado0 = await getObraBySoldDate(data.user.id, sabado0);
    const ventadomingo0 = await getObraBySoldDate(data.user.id, domingo0);

    estaSemana = {
      ventalunes: ventalunes.length,
      ventamartes: ventamartes.length,
      ventamiercoles: ventamiercoles.length,
      ventajueves: ventajueves.length,
      ventaviernes: ventaviernes.length,
      ventasabado: ventasabado.length,
      ventadomingo: ventadomingo.length,
    };

    semanaPasada = {
      ventalunes0: ventalunes0.length,
      ventamartes0: ventamartes0.length,
      ventamiercoles0: ventamiercoles0.length,
      ventajueves0: ventajueves0.length,
      ventaviernes0: ventaviernes0.length,
      ventasabado0: ventasabado0.length,
      ventadomingo0: ventadomingo0.length,
    };
  }
  var ventaSemanal = await getObrasWeekly(data.user.id, sieteDias, hoy);
  var ventaMensual = await getObrasMothly(data.user.id, treintaDias, hoy);

  if (ventaSemanal.length > 0) {
    for (var i = 0; i < ventaSemanal.length; i++) {
      ventasSemana = ventasSemana + ventaSemanal[i].precio;
    }
  }

  if (ventaMensual.length >= 0) {
    for (var i = 0; i < ventaMensual.length; i++) {
      ventasMes = ventasMes + ventaMensual[i].precio;
    }
  }

  const visitantesTotales = await getDataArtist(data.user.id);
  const ventasTotales = await getArtistObrasSold(data.user.id);
  const conversionVisitas =
    (ventasTotales / visitantesTotales[0].visitas) * 100;

  //------------EXPOSICION------------------//

  const colecciones = await getFiveArtistsCollections(data.user.id);
  const evento = await getLastArtistEvent(data.user.id);

  var visitasEvento = 0;
  if (evento.length > 0) {
    visitasEvento = evento[0].visitas;
  }
  const eventos = await getAllEvents(data.user.id)
  var totalVisitasEventos = 0;
  if (eventos.length > 0) {
    for (var i = 0; i < eventos.length; i++) {
      totalVisitasEventos = totalVisitasEventos + eventos[i].visitas;
    }
  }

  var estaSemanaPerfil = {
    perfillunes: 0,
    perfilmartes: 0,
    perfilmiercoles: 0,
    perfiljueves: 0,
    perfilviernes: 0,
    perfilsabado: 0,
    perfildomingo: 0,
  };

  var semanaPasadaPerfil = {
    perfillunes0: 0,
    perfilmartes0: 0,
    perfilmiercoles0: 0,
    perfiljueves0: 0,
    perfilviernes0: 0,
    perfilsabado0: 0,
    perfildomingo0: 0,
  };

  var estaSemanaGaleria = {
    galerialunes: 0,
    galeriamartes: 0,
    galeriamiercoles: 0,
    galeriajueves: 0,
    galeriaviernes: 0,
    galeriasabado: 0,
    galeriadomingo: 0,
  };

  var semanaPasadaGaleria = {
    galerialunes0: 0,
    galeriamartes0: 0,
    galeriamiercoles0: 0,
    galeriajueves0: 0,
    galeriaviernes0: 0,
    galeriasabado0: 0,
    galeriadomingo0: 0,
  };

  //---------------CLIENTES ----------------//

  const artistaCurrent = await getDataArtist(data.user.id);
  var totalVisitasPerfil = 0;
  var totalVisitasGaleria = 0;

  totalVisitasPerfil = artistaCurrent[0].visitas;
  totalVisitasGaleria = artistaCurrent[0].visitasGaleria;

  const nombre = await getUserName(data.user.id);
  const email = nombre[0].email;
  const url = data.url;

  return {
    nombre: nombre[0],
    totalVisitasPerfil,
    totalVisitasGaleria,
    estaSemana,
    estaSemanaPerfil,
    estaSemanaGaleria,
    totalVisitasEventos,
    visitasEvento,
    colecciones,
    semanaPasada,
    semanaPasadaPerfil,
    semanaPasadaGaleria,
    ventasSemana,
    ventasMes,
    conversionVisitas,
    artista,
    logueado,
    email,
    url,
    dashboard,
    stripeRegistro,
  };
};

module.exports = dashboardStats;
