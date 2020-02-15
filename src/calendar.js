import React, { Component, Fragment } from "react";
import moment from "moment";
import "./calendar.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Paper, Fade } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import { months_mapping } from "./months";

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days_in_current_month: moment().daysInMonth(),
      elementIn: true,
      date_obj: {
        days_in_current_month: moment().daysInMonth(),
        date_UTC: new Date(moment().utc())
      }
    };
    this.shorted_days = moment.weekdaysShort();
  }

  //shorted days
  getHeaderDays = () => {
    const { day_box } = month_days_style;
    return (
      <div style={{ display: "flex" }}>
        {this.shorted_days.map((day, i) => {
          return (
            <div key={i} style={day_box}>
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  //return last days of previous month before 1st day of current month
  getBlankDays = () => {
    const { blank_box } = month_days_style;
    const { date_obj } = this.state;
    const first_day = moment(date_obj.date_UTC)
      .startOf("month")
      .format("d");
    const previous_month = moment(date_obj.date_UTC)
      .subtract(1, "M")
      .format("LL");
    const days_in_previous_month = moment(previous_month).daysInMonth();
    let blanks = [];
    for (let i = 0; i <= days_in_previous_month; i++) {
      blanks.push(
        <div key={`blank_${i}`} style={blank_box}>
          {i}
        </div>
      );
    }
    const last_days_of_previous_month = blanks.slice(
      Math.max(blanks.length - first_day, 1)
    );
    return last_days_of_previous_month;
  };

  //return the days of the current month
  getDayInMOnth = () => {
    const { day_box, day_box_active } = month_days_style;
    const { classes } = this.props;
    const { date_obj } = this.state;
    const first_day = moment(date_obj.date_UTC).startOf("month");
    let days_in_month = [];
    for (let i = 1; i <= date_obj.days_in_current_month; i++) {
      let day = moment(first_day).add(i - 1, "d"); //add number of day to to first day to find cuurent date
      days_in_month.push(
        <Button
          onClick={() => {
            this.onSelectedDay(day);
          }}
          key={i}
          className={classes.button}
          style={this.checkCurrentDay(i) ? day_box_active : day_box}
        >
          {i}
        </Button>
      );
    }
    return days_in_month;
  };

  onSelectedDay = day => {
    console.log(moment(day).format("YYYY-MM-DD"));
  };

  //get the array which includes blanks and days of the current month
  getFinalDaysInMonth = () => {
    const total = [...this.getBlankDays(), ...this.getDayInMOnth()];
    let rows = [];
    let cells = [];
    total.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === total.length - 1) {
        rows.push(cells);
      }
    });
    return rows;
  };

  //return true for current date and changes the color style.
  checkCurrentDay = day => {
    return day == moment().format("D");
  };

  //return previous month
  previousMonth = () => {
    const { date_obj } = this.state;
    const previous_month = moment(date_obj.date_UTC)
      .subtract(1, "M")
      .format("LL");
    this.setState({
      date_obj: {
        days_in_current_month: moment(previous_month).daysInMonth(),
        date_UTC: new Date(moment(previous_month).utc())
      },
      elementIn: false
    });
    setTimeout(() => {
      this.setState({
        elementIn: true
      });
    }, 10);
  };

  //return next month
  nextMonth = () => {
    const { date_obj } = this.state;
    const next_month = moment(date_obj.date_UTC)
      .add(1, "M")
      .format("LL");
    this.setState({
      date_obj: {
        days_in_current_month: moment(next_month).daysInMonth(),
        date_UTC: new Date(moment(next_month).utc())
      },
      elementIn: false
    });
    setTimeout(() => {
      this.setState({
        elementIn: true
      });
    }, 10);
  };

  render() {
    const { classes } = this.props;
    const { date_obj } = this.state;
    const { container, main } = style_semi_header;
    const { days_in_month_container } = month_days_style;
    const month = moment(date_obj.date_UTC)
      .toDate()
      .getMonth();
    const year = moment(date_obj.date_UTC)
      .toDate()
      .getFullYear();

    return (
      <Fragment>
        <div style={calendar_container}>
          <Paper elevation={4} className={classes.paper}>
            <div style={container}>
              <div style={main}>
                <Button className={classes.button} onClick={this.previousMonth}>
                  <ArrowBackIcon className={classes.arrow} />
                </Button>
              </div>
              <div style={main}>{`${months_mapping[month]} ${year}`}</div>
              <div style={main}>
                <Button className={classes.button} onClick={this.nextMonth}>
                  <ArrowForwardIcon className={classes.arrow} />
                </Button>
              </div>
            </div>
            {this.getHeaderDays()}
            <Fade
              timeout={{ enter: 500 }}
              direction={"left"}
              in={this.state.elementIn}
            >
              <div style={days_in_month_container}>
                {this.getFinalDaysInMonth()}
              </div>
            </Fade>
          </Paper>
        </div>
      </Fragment>
    );
  }
}

//styles

const calendar_container = {
  width: "330px"
};

const month_days_style = {
  days_in_month_container: {
    display: "flex",
    flexWrap: "wrap"
  },
  day_box: {
    width: "45px",
    height: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  blank_box: {
    width: "45px",
    height: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "grey",
    opacity: 0.6
  },
  day_box_active: {
    width: "45px",
    height: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "red"
  }
};

const style_semi_header = {
  container: {
    height: 56,
    backgroundColor: "#6200EE",
    display: "flex",
    justifyContent: "space-around"
  },
  main: {
    display: "flex",
    alignItems: "center",
    color: "white"
  }
};

const styles = theme => ({
  paper: {
    height: 358
  },
  button: {
    minWidth: "37px",
    borderRadius: "30px"
  },
  arrow: {
    color: "white"
  }
});

export default withStyles(styles)(Calendar);
