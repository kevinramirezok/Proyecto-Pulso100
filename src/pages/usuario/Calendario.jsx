import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { useSchedule } from '../../context/ScheduleContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { CheckCircle, Trash2 } from 'lucide-react';

moment.locale('es');
const localizer = momentLocalizer(moment);

export default function Calendario() {
  const { scheduledWorkouts, completeScheduledWorkout, deleteScheduledWorkout } = useSchedule();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Convertir workouts programados a eventos del calendario
  const events = useMemo(() => {
    return scheduledWorkouts.map(sw => ({
      id: sw.id,
      title: sw.workoutName,
      start: new Date(sw.scheduledDate),
      end: new Date(sw.scheduledDate),
      resource: sw,
    }));
  }, [scheduledWorkouts]);

  const eventStyleGetter = (event) => {
    const workout = event.resource;
    const isCompleted = workout.status === 'completed';
    
    return {
      className: `${workout.workoutCategory} ${isCompleted ? 'completed' : ''}`,
    };
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Calendario</h1>
        <p className="text-gray-400">Organizá tus entrenamientos</p>
      </div>

      <div className="bg-pulso-negroSec rounded-2xl p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Entrenamiento',
            noEventsInRange: 'No hay entrenamientos programados',
          }}
        />
      </div>

      {/* Modal Detalle Evento */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.workoutName}
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="bg-pulso-negro rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Fecha programada</p>
              <p className="text-white font-bold">
                {moment(selectedEvent.scheduledDate).format('DD/MM/YYYY')}
              </p>
            </div>

            <div className="bg-pulso-negro rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Duración</p>
              <p className="text-white font-bold">{selectedEvent.workoutDuration} minutos</p>
            </div>

            <div className="bg-pulso-negro rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Estado</p>
              <p className={`font-bold ${
                selectedEvent.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {selectedEvent.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
              </p>
            </div>

            {selectedEvent.status === 'pending' && (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    completeScheduledWorkout(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                >
                  <CheckCircle size={20} className="mr-2" />
                  Marcar como Completado
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    deleteScheduledWorkout(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                >
                  <Trash2 size={20} className="mr-2" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}