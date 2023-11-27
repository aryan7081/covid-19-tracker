import React, { useRef, useState } from "react";
import {
  Card,
  Typography,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  CardHeader,
  CardBody,
  Checkbox,
  Input,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Category from "./category";
export default function Type(props) {
  const Option = (prop) => {
    const x = props.getVal(prop.option);
    const [isChecked, setChecked] = useState(x === undefined ? false : x);
    const checkboxId = prop.option.replace(/\s+/g, "-").toLowerCase();
    return (
      <Checkbox
        id={checkboxId}
        ripple={true}
        label={prop.option}
        onChange={() => {
          setChecked((prevChecked) => {
            prop.updateFunc(prop.option, !prevChecked);
            return !prevChecked; // Return the new state
          });
        }}
        checked={isChecked}
      />
    );
  };
  const Range = (prop) => {
    const updateRange = (start, end) => {
      props.updateFunc("range", [start, end]);
    };
    let x = props.getVal("range");
    if (x === undefined) {
      x = [0, 0];
    }
    const [startVal, setStartVal] = useState(x[0]);
    const [endVal, setEndVal] = useState(x[1]);

    return (
      <div className="flex h-full items-center justify-around align-middle">
        <Input
          onChange={(event) => {
            setStartVal(event.target.value);
            updateRange(event.target.value, endVal);
          }}
          type="number"
          label="Min"
          className="w-full"
          defaultValue={startVal}
          containerProps={{
            className: "min-w-0",
          }}
        />
        <Typography>to</Typography>
        <Input
          onChange={(event) => {
            setEndVal(event.target.value);
            updateRange(startVal, event.target.value);
          }}
          type="number"
          label="Max"
          className=""
          defaultValue={endVal}
          containerProps={{
            className: "min-w-0",
          }}
        />
      </div>
    );
  };
  const Sublist = (prop) => {
    console.log(props.getVal("data"));
    const [openNo, setOpen] = useState(0);
    const [sublist, setSublist] = useState(props.getVal(props.titl));
    const updatesublist = (key, value) => {
      sublist[key] = value;
      setSublist(sublist);
      props.updateFunc(prop.titl, sublist[prop.titl]);
    };

    const handleOpen = (value) => {
      console.log(value);
      console.log(openNo);
      setOpen(openNo === value ? 0 : value);
    };
    return (
      <div className="h-max">
        <Category
          // isSub={false}
          // title={item.title}
          // type={item.type}
          // data={item.data}
          // updateFunc={updateFilter}
          // id={index + 1}
          // openNo={openNo === index + 1}
          // handleOpen={handleOpen
          type="list"
          isSub={true}
          title={prop.titl}
          data={prop.data[prop.titl]}
          isOpen={openNo === prop.index + 1}
          // isOpen={true}
          id={prop.index + 1}
          updateFunc={updatesublist}
          handleOpen={(id) => {
            handleOpen(id);
            props.updateScreen(1);
          }}
        />
      </div>
    );
  };
  const findSub = (type, data) => {
    if (type === "list") {
      return data.map((option) => {
        return (
          <Option option={option} key={option} updateFunc={props.updateFunc} />
        );
      });
    } else if (type === "range") {
      return <Range />;
    } else {
      const newObj = [];
      Object.keys(data).forEach((key, index) => {
        newObj.push(
          <Sublist
            titl={key}
            data={data}
            index={index}
            updateFunc={props.updateFunc}
          />
        );
      });
      return newObj;
    }
  };
  return (
    <Card className="h-full rounded-none shadow-none">
      {findSub(props.type, props.data)}
    </Card>
  );
}
