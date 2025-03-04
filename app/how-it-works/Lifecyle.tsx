import Image from "next/image";
import placeholder_img from "./placeholder.png";

export default function Lifecycle() {
  return (
    <section className="max-w-7xl w-full mx-auto p-4 mt-28 flex flex-col gap-52">
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of onbaording and profile creation"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 bg-blue-200 p-2">
          <h2 className="font-semibold text-xl py-2">Onboarding</h2>
          <ul>
            <li>Signup with your email address</li>
            <li>verify your email address</li>
            <li>
              primary communication channel is email so make sure it is correct
              and you are up to date with it
            </li>
            <li>
              go to rofile section ad add necesary details like name, date of
              birth to see timeline
            </li>
            <li>explore settings and dahsboard </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 bg-blue-100 p-2">
          <h2>Add data</h2>
          <div>
            explain how to add data, explain segments, explain object storage
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="segments snapshot"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of factors choices"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 bg-blue-200 p-2">
          <h2>Security - factors</h2>
          <div>
            explain metamodels, explain pods, explain encryptions, explain
            factors
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 bg-blue-100 p-2">
          <h2>trigger & will execution</h2>
          <div>explain triggers, notifications, will execution schedule</div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="will execuion schedule image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="onion layer with emphasis on time enc layer"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 bg-blue-200 p-2">
          <h2>time capsule encryption</h2>
          <div>
            explain how time locked encryption works, explain the cipherwill
            promise
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 bg-blue-100 p-2">
          <h2>Beneficiry access</h2>
          <div>
            explain the Beneficiry acess, their dahsboard, timeline and data
            deletion at the end
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="beneficiary dashboard image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div className="-mt-24">
        <h2 className="text-2xl font-semibold py-4">Important facts</h2>
        <ul className="list-disc list-inside">
          <li>first point</li>
          <li>second point</li>
        </ul>
      </div>
    </section>
  );
}
