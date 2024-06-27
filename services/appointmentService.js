var appointment = require("../model/Appoitment")
var mongoose = require("mongoose")
var AppointmentFactory = require("../factories/AppointmentFactory")
const Appo = mongoose.model("Appointment", appointment)
var mailer = require("nodemailer")

class AppointmentService {
      async Create(name, email, description, cpf, date, time){
           var newAppo = new Appo({
              name,
              email, 
              description,
              cpf,
              date,
              time, 
              finished: false,
              notified:false
           });

         try {
            await  newAppo.save()
            return true
         } catch (error) {
            console.log(err)
            return false
         }
      }

      async GetAll(showFinished){
        if(showFinished) {
           return await Appo.find();
        } else {
          var appos = await Appo.find({'finished': false});
          var appointments = []

          appos.forEach(appointment => {
             if(appointment.date != undefined) {
                appointments.push(AppointmentFactory.Build(appointment))

             }
          });

          return appointments
        }

      }

      async GetById(id) {
       
         try {
            var event = await Appo.findOne({'_id':id})
            return event
 
         } catch (error) {
            console.log(error)
         }
      }

      async Finish(id) {
         try {
            
             await  Appo.findByIdAndUpdate(id, {finished:true});
             return true
         } catch (error) {
            console.log(error)
            return false
         }
      }

      async Search(query) {
         try {
            var appos = await Appo.find().or([{email:query},{cpf:query}])
             return appos;
            
         } catch (error) {
            console.log(error)
            return []
         }
         
      }

      async SendNotification(){
         var appos = await this.GetAll(false)
         var transporter = mailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "d071d2e0fc6c38",
              pass: "55e6b4548c1e9b"
            }
          });
         appos.forEach(async app => {
            var date = app.start.getTime();
            var hour = 1000 * 60 * 60;
            var gap = date - Date.now();
            
            if(gap <= hour) {
              
               if(!app.notified){
              await Appo.findByIdAndUpdate(app.id,{notified:true})
                transporter.sendMail({
                  from:'Lucas Ferreira da Cruz<lucas@ferreira.com.br>',
                  to:app.email,
                  subject:"Sua consulta está se aproximando..",
                  text:"Sua consulta vai acontecer em uma hora",
                  html: '<p>Este é um <b>e-mail de teste</b> enviado com Node.js e Mailtrap!</p>' // HTML do e-mail


                }).then(() => {

                }).catch(err => {

                })
              }
            }
         })

      }
}


module.exports = new AppointmentService()
