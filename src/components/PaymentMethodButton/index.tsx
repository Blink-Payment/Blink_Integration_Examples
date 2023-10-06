type PaymentMethodButtonProps = {
  method: string;
  name: string;
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  icon: React.FC;
  disabled?: boolean;
};

export function PaymentMethodButton({
  method,
  paymentType,
  setPaymentType,
  icon: Icon,
  name,
  disabled = false,
}: PaymentMethodButtonProps) {
  return (
    <label className="relative flex-1 cursor-pointer items-center">
      <input
        type="radio"
        name="paymentMethod"
        value={method}
        checked={paymentType === method}
        onChange={() => {
          setPaymentType(method);
        }}
        disabled={disabled}
        className="absolute h-0 w-0 opacity-0"
      />
      <div
        className={`flex h-20 flex-row items-center justify-center gap-4 py-2 text-center text-black transition duration-150 hover:bg-slate-100 md:h-28 md:flex-col md:gap-2
        ${
          paymentType === method
            ? " border-2 border-black"
            : "border-2 border-slate-100"
        } rounded-md  bg-white`}
      >
        <Icon />
        {name}
      </div>
    </label>
  );
}
