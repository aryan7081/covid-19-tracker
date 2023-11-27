export default function ButtonPrimary({ text, onClick, size }) {
    let width, paddingY, fontSize;
    switch (size) {
        case 'sm':
            width = 'w-32 sm:w-24 md:w-32 lg:w-32 xl:w-32 2xl:w-32';
            paddingY = 'py-2 sm:py-1 md:py-2 lg:py-2 xl:py-2 2xl:py-2';
            fontSize = 'text-sm sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm';
            break;
        case 'lg':
            width = 'w-64 sm:w-48 md:w-64 lg:w-64 xl:w-64 2xl:w-64';
            paddingY = 'py-4 sm:py-3 md:py-4 lg:py-4 xl:py-4 2xl:py-4';
            fontSize = 'text-lg sm:text-md md:text-lg lg:text-lg xl:text-lg 2xl:text-lg';
            break;
        case 'md':
        default:
            width = 'w-48 sm:w-36 md:w-48 lg:w-48 xl:w-48 2xl:w-48';
            paddingY = 'py-3 sm:py-2 md:py-3 lg:py-3 xl:py-3 2xl:py-3';
            fontSize = 'text-base sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base';
    }
    
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer transition-all duration-300 drop-shadow-lg bg-[#EB5017] hover:bg-[#C03D13] font-inter font-[600] flex items-center justify-center rounded-md
        text-white ${width} ${paddingY} ${fontSize} sm:w-auto`}
      >
        <p className="leading-normal text-center">
          {text}
        </p>
      </div>
    );
}
