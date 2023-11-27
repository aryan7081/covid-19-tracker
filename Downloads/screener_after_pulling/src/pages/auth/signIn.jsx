import AuthUI from './authUI';

export function SignIn() {
  // redirect in case of logged in 
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-between max-w-lg w-80 bg-white py-8 px-4 rounded shadow">
        <div className="flex justify-center items-center pb-10 flex-col">
          <div> <img src="/img/logo.svg" alt="Logo" className="h-12 w-auto" /></div>
          <div className='text-[#EB5017] text-2xl font-inter mt-2 font-medium'>Labh</div>
        </div>
        <AuthUI view={"sign_in"}/>
      </div>
    </div>
  );
}

export default SignIn;
