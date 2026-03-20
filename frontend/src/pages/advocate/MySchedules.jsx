import { useEffect, useState } from "react";
import { fetchAdvocateSchedules, addAdvocateSchedule, deleteAdvocateSchedule } from "../../api/advocateApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../newstyles.css";
import "./calendar.css"; // our freshly injected tailored styles

function MySchedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View states
  const [viewMode, setViewMode] = useState("month"); // 'month' or 'week'
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the month being viewed
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());

  // Form states
  const [dateInput, setDateInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [slotInput, setSlotInput] = useState("WHOLE_DAY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await fetchAdvocateSchedules();
      setSchedules(data);
    } catch (error) {
      toast.error("Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getSchedulesForDay = (date) => {
    return schedules.filter((s) => isSameDay(new Date(s.date), date));
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Calendar generation logic
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);

    const days = [];
    
    // Previous month filler days
    const prevMonthDays = daysInMonth(month - 1, year);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Next month filler days (to complete 42 cells = 6 weeks)
    const fillerCount = 42 - days.length;
    for (let i = 1; i <= fillerCount; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newStart = new Date(selectedWeekStart);
      newStart.setDate(newStart.getDate() - 7);
      setSelectedWeekStart(newStart);
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newStart = new Date(selectedWeekStart);
      newStart.setDate(newStart.getDate() + 7);
      setSelectedWeekStart(newStart);
    }
  };

  const handleDayClick = (date) => {
    // Navigate to week mode centered around this date
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek); // Go to Sunday
    setSelectedWeekStart(startOfWeek);
    
    // Set the date input for ease of use
    setDateInput(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`
    );
    
    setViewMode("week");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateInput) {
      toast.warn("Please select a date.");
      return;
    }

    if (isPastDate(new Date(dateInput))) {
      toast.warn("Cannot schedule for past dates.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addAdvocateSchedule({ date: dateInput, reason: reasonInput, slot: slotInput });
      toast.success("Schedule added successfully!");
      setReasonInput("");
      setDateInput("");
      setSlotInput("WHOLE_DAY");
      loadSchedules();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvocateSchedule(id);
      toast.success("Date marked as Available.");
      setShowDeleteModal(false);
      setDeleteConfirmId(null);
      loadSchedules();
    } catch (error) {
      toast.error("Failed to remove schedule.");
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  const calendarDays = generateCalendarDays();

  // Generate the 7 days for the Week Planner
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(selectedWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="client-dashboard-new">
      <div className="documents-header-new">
        <h1 className="page-title-new">My Schedules & Calendar</h1>
        <div className="documents-header-buttons">
          <button className="dashboard-btn-new" onClick={() => navigate("/dashboard/advocate")}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="calendar-container anim-fade-in">
        <div className="calendar-header">
          <div className="view-toggle-btns">
            <button 
              className={viewMode === "month" ? "active" : ""} 
              onClick={() => setViewMode("month")}
            >
              Month View
            </button>
            <button 
              className={viewMode === "week" ? "active" : ""} 
              onClick={() => setViewMode("week")}
            >
              Week Planner
            </button>
          </div>
          
          <h3>
            {viewMode === "month" 
              ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Week of ${weekDays[0].toLocaleDateString("en-GB", {day: "numeric", month: "short"})}`
            }
          </h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calendar-nav-btn" onClick={handlePrev}>❮ Prev</button>
            <button className="calendar-nav-btn" onClick={handleNext}>Next ❯</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading schedules...</div>
        ) : viewMode === "month" ? (
          <>
            <div className="calendar-grid">
              {dayNames.map((d) => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}
              
              {calendarDays.map((cell, index) => {
                const daySchedules = getSchedulesForDay(cell.date);
                const hasSchedule = daySchedules.length > 0;
                
                let isFullyBooked = false;
                let isPartiallyBooked = false;
                let badgeText = "";

                if (hasSchedule) {
                  if (daySchedules.length === 2 || daySchedules.some(s => s.slot === "WHOLE_DAY")) {
                    isFullyBooked = true;
                    badgeText = "Whole day booked";
                  } else {
                    isPartiallyBooked = true;
                    const slotText = daySchedules[0].slot === "FN" ? "Forenoon" : "Afternoon";
                    badgeText = `${slotText} Booked`;
                  }
                }

                const isSunday = cell.date.getDay() === 0;
                const isToday = isSameDay(cell.date, new Date());
                const pastDate = isPastDate(cell.date);
                
                let cellClass = `calendar-cell ${cell.isCurrentMonth ? "current-month" : "other-month"}`;
                if (isFullyBooked) cellClass += " booked";
                else if (isPartiallyBooked) cellClass += " partially-booked";
                
                if (isSunday && cell.isCurrentMonth && !hasSchedule) cellClass += " holiday";
                if (isToday) cellClass += " today";
                if (pastDate) cellClass += " past-date"; // Keeping class logic even if CSS rules were visually disabled earlier

                return (
                  <div 
                    key={index} 
                    className={cellClass}
                    onClick={() => { 
                      if (cell.isCurrentMonth) handleDayClick(cell.date); 
                    }}
                  >
                    <div>
                      <span className="day-number">{cell.day}</span>
                      {isToday && <span className="today-label">Today</span>}
                    </div>
                    
                    {hasSchedule ? (
                      <span className={`booked-badge ${isFullyBooked ? "full" : "partial"}`}>{badgeText}</span>
                    ) : isSunday && cell.isCurrentMonth ? (
                      <span className="holiday-badge">Sunday</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="week-planner-container anim-fade-in">
            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
              Click on an available slot (or select from the form below) to mark it as busy. Maximum 2 slots per day.
            </p>
            <div className="planner-grid">
              {weekDays.map((date, idx) => {
                const daySchedules = getSchedulesForDay(date);
                const pastDate = isPastDate(date);
                return (
                  <div key={idx} className={`planner-day-col ${pastDate ? "past-date" : ""}`}>
                    <div className="planner-day-title">
                      <span className="day-name">{dayNames[date.getDay()]}</span>
                      <span>{date.getDate()} {monthNames[date.getMonth()].slice(0, 3)}</span>
                    </div>
                    
                    <div className="planner-slots">
                      {/* Render booked slots */}
                      {daySchedules.map(sch => (
                        <div key={sch.schedule_id} className="slot-card unavailable">
                          <span className="slot-title">
                            Unavailable - {sch.slot === 'FN' ? 'Forenoon (FN)' : sch.slot === 'AN' ? 'Afternoon (AN)' : 'Whole Day'}
                          </span>
                          <span className="slot-reason">{sch.reason || "Booked"}</span>
                          {!pastDate && (
                            <button 
                              className="remove-btn"
                              onClick={() => {
                                setDeleteConfirmId(sch.schedule_id);
                                setShowDeleteModal(true);
                              }}
                            >
                              Mark Available
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Render available slots if limit not reached */}
                      {(!pastDate && daySchedules.length < 2 && !daySchedules.some(s => s.slot === "WHOLE_DAY")) && (
                        <div 
                          className="slot-card" 
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setDateInput(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
                          }}
                        >
                          <span className="slot-title">Available</span>
                          <span className="slot-reason">Click to select day</span>
                        </div>
                      )}
                      
                      {(pastDate && daySchedules.length < 2 && !daySchedules.some(s => s.slot === "WHOLE_DAY")) && (
                        <div 
                          className="slot-card" 
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            toast.warn("Cannot schedule for dates in the past.");
                          }}
                        >
                          <span className="slot-title">Available</span>
                          <span className="slot-reason">Past Slot</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="add-schedule-modal">
              <h4>Add Out-of-Office / Busy Schedule</h4>
              <form onSubmit={handleSubmit}>
                <label>Select Date</label>
                <input
                  type="date"
                  value={dateInput}
                  min={todayStr}
                  onChange={(e) => setDateInput(e.target.value)}
                  required
                />

                <label>Select Slot</label>
                <select value={slotInput} onChange={(e) => setSlotInput(e.target.value)}>
                  <option value="WHOLE_DAY">Whole Day</option>
                  <option value="FN">Forenoon (FN)</option>
                  <option value="AN">Afternoon (AN)</option>
                </select>
                
                <label>Reason / Description (e.g. Leave, Hearings, Booked)</label>
                <input
                  type="text"
                  placeholder="Personal Leave, etc."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                />
                
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Mark as Booked"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3>Remove Schedule</h3>
            <p>Are you sure you want to open up this blocked date?</p>
            <div className="custom-modal-actions">
              <button className="btn-secondary" onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmId(null);
              }}>
                Discard
              </button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySchedules;
