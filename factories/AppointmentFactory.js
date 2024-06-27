class AppointmentFactory {

   Build(simpleAppointment){

    var day      =    simpleAppointment.date.getDate()+1;
    var month    =    simpleAppointment.date.getMonth();
    var year     =    simpleAppointment.date.getFullYear();
    var hour     =    Number.parseInt(simpleAppointment.time.split(":")[0]);
    var minutes  =    Number.parseInt(simpleAppointment.time.split(":")[1]);
    var starDate = new Date(year, month, day, hour, minutes,0,0)
    
    var appo = {
        id: simpleAppointment._id,
        title:simpleAppointment.name + " - " + simpleAppointment.description,
        start:starDate,
        end:starDate,
        notified:simpleAppointment.notified,
        email:simpleAppointment.email
    }
    
    return appo
     
   }
}

module.exports = new AppointmentFactory