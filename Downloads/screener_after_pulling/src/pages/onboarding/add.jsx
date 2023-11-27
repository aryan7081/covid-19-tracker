import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input, Select, Option } from "@material-tailwind/react";
import {adduser} from '@/utils/api';
import {Mixpanel} from '@/utils/mixpanel'


export function AddUser() {
  const [name, setName] = useState('');
  const [marketPref, setMarketPref] = useState('');
  const [goal, setGoal] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isValidName = (n) => n.length > 0;
  const isValidMarketPref = (mp) => ['us', 'india'].includes(mp);
  const isValidGoal = (g) => ['Extra income', 'Savings', 'Exploring'].includes(g);

  const handleSubmit = async () => {
      const newErrors = {};
      console.log('here')

      if (!isValidName(name)) newErrors.name = "Name is required";
      if (!isValidMarketPref(marketPref)) newErrors.name = "Please select a market preference";
      if (!isValidGoal(goal)) newErrors.name = "Please select a goal";

      console.log('here', name, marketPref, goal, errors);

      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          Mixpanel.track("Add user error", newErrors)
          return;
      }

      // Make the POST call if validations pass
      const res = await adduser({name: name, goals: goal, market_preference: marketPref});

      Mixpanel.people.set({
        $first_name: name,
        $goals: goal,
        $market_preference: marketPref
      });

      console.log('res', res);
      if (res.user_id) {
        window.location.reload();
      }
    };

    return (
        <div className="w-full flex flex-col items-center mt-12 mb-8 gap-12 min-h-screen">
            <h2 className="text-2xl font-medium text-center">Let's peronalise your experience</h2>
            <div className="bg-white shadow-md rounded-md p-8 w-3/4 md:w-1/2">
              <div className="mb-4">
                  {/* ... (name input) */}
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="name">Name</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 w-full"
                        placeholder="Enter your name"
                    />
                </div>
                
                {/* Market Preference Dropdown */}
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="market">Market Preference</label>
                    <Select
                        value={marketPref}
                        onChange={(e) => setMarketPref(e)}
                        className="p-2 w-full "
                    >
                        <Option value="" disabled>Select Market</Option>
                        <Option value="us">US</Option>
                        <Option value="india">India</Option>
                    </Select>
                </div>

                {/* Goals Dropdown */}
                <div className="mb-4">
                    <label className="block text-black mb-2" htmlFor="goal">Goals</label>
                    <Select
                        value={goal}
                        onChange={(e) => setGoal(e)}
                        className="p-2 w-full "
                    >
                        <Option value="" disabled>Select Your Goal</Option>
                        <Option value="Extra income">Extra income</Option>
                        <Option value="Savings">Savings</Option>
                        <Option value="Exploring">Exploring</Option>
                    </Select>
                </div>

                {/* Submit Button */}
                <button 
                    onClick={handleSubmit} 
                    className="bg-[#EB5017] text-white p-2 rounded w-full hover:bg-opacity-90 transition duration-300"
                >
                    Submit
                </button>

            </div>
        </div>
    );
}

export default AddUser;
