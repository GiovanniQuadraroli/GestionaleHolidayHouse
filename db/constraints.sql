begin transaction;

create function V_Pren_Date() returns trigger as $V_Pren_Date$
declare numPren integer;
begin
    select count(pren.id) into numPren from Prenotazione pren
            where pren.id <> new.id
                and pren.camera = new.camera
                and pren.dataArrivo > new.dataArrivo 
                and pren.dataArrivo < new.dataArrivo + new.numNotti;
    if (numPren > 0) then
       raise exception 'Camera non disponibile';
    end if;

    select count(pren.id) into numPren from Prenotazione pren
            where pren.id <> new.id
                and pren.camera = new.camera
                and pren.dataArrivo < new.dataArrivo 
                and pren.dataArrivo + pren.numeroNotti < new.dataArrivo;
    if (numPren > 0) then
        raise exception 'Camera non disponibile';
    end if;
    return new;
end;
$V_Pren_Date$ language plpgsql;
create trigger Pren_date
after insert on Prenotazione
for each row execute procedure V_Pren_Date();

commit;