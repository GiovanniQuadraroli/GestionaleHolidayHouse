begin transaction;

-- Creazione domini

create domain StringS as varchar(50);

create table Proprietario (
    nome StringS not null,
    cognome StringS not null,
    username StringS not null,
    mail StringS not null,
    password StringS not null,
    id serial,

    primary key (id),
    unique (username)
);

create table Struttura (
    nome StringS not null,
    indirizzo StringS not null,
    id serial,

    primary key (id),
    foreign key (id) references Proprietario(id)
);

create table Camera (
    nome StringS not null,
    numPosti integer not null,
    prezzo real not null,
    disponibile boolean not null,
    id serial,

    check (numPosti > 0),
    check (prezzo > 0),
    primary key (id),
    foreign key (id) references Struttura(id) deferrable
);

create table Spesa (
    motivazione text,
    costo real not null,
    id serial,

    check (costo >= 0),
    primary key (id),
    foreign key (id) references Camera(id) deferrable
);

create table Prenotazione (
    numeroNotti integer not null,
    numOspiti integer not null,
    id serial,
    costo real not null,
    cancellata boolean not null,
    dataArrivo date not null,
    camera serial,

    check (numeroNotti > 0),
    check (numOspiti > 0),
    check (costo > 0),
    primary key (id),
    foreign key (camera) references Camera(id) deferrable
);

commit;

