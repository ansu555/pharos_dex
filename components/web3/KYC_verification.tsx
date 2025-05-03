"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// // import { ethers } from "ethers";
// // import TransgateConnect from "@zkpass/transgate-js-sdk";
// // import registryAbi from "../../app/abis/ZKPassKYCRegistry.json";

// export function KycVerification({
//   contractAddress,
//   userAddress,
// }: {
//   contractAddress: string;
//   userAddress: string;
// }) {
//   // Simplified version that just shows a button and alert
//   // All complex verification logic is commented out for future use

//   /* 
//   // State management - re-enable when implementing full KYC
//   const [kycStatus, setKycStatus] = useState<null | boolean>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // TransGate init
//   const connector = useMemo(
//     () => new TransgateConnect(process.env.NEXT_PUBLIC_TRANSGATE_APP_ID!),
//     []
//   );
//   const schemaId = process.env.NEXT_PUBLIC_TRANSGATE_SCHEMA_ID!;

//   // On mount or when userAddress changes, check on‑chain KYC status
//   useEffect(() => {
//     if (!userAddress) return;
//     setLoading(true);
//     (async () => {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);

//         // Sanity: are we on the right network? is there code at that address?
//         const network = await provider.getNetwork();
//         console.log("KYC registry on network:", network.name);
//         const code = await provider.getCode(contractAddress);
//         console.log("KYC registry code:", code);
//         if (code === "0x") {
//           throw new Error("No contract deployed at " + contractAddress);
//         }

//         // Call view via callStatic
//         const contract = new ethers.Contract(
//           contractAddress,
//           registryAbi.abi,
//           provider
//         );
//         const verified: boolean = await contract.callStatic.checkKYC(userAddress);
//         setKycStatus(verified);
//       } catch (e: any) {
//         console.error("checkKYC error", e);
//         setError("Unable to read on‑chain KYC status");
//         setKycStatus(false);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userAddress, contractAddress]);

//   // If not verified, trigger TransGate + submit proof
//   async function handleKyc() {
//     setLoading(true);
//     setError(null);

//     try {
//       // Launch TransGate flow (QR on desktop / app on mobile)
//       const { proof, inputs } = (await connector.launch(
//         schemaId,
//         userAddress
//       )) as { proof: string; inputs: string[] };

//       // Submit proof to your registry
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         contractAddress,
//         registryAbi.abi,
//         signer
//       );
//       const tx = await contract.submitKYC(proof, inputs);
//       await tx.wait();

//       // re‑check via callStatic to avoid a revert exception here
//       const verified: boolean = await contract.callStatic.checkKYC(userAddress);
//       setKycStatus(verified);
//     } catch (e: any) {
//       console.error("submitKYC error", e);
//       setError(e.message);
//       setKycStatus(false);
//     } finally {
//       setLoading(false);
//     }
//   }
//   */

//   return (
//     <button
//       onClick={() => alert("KYC verification under development - coming soon!")}
//       className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
//     >
//       Verify KYC
//     </button>
//   );
// }
export function KycVerification({
  contractAddress,
  userAddress,
}: {
  contractAddress: string;
  userAddress: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  /* 
  // Original KYC verification code commented out for future use
  ...
  */

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="default"
        size="sm"
      >
        Verify KYC
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">KYC Verification</DialogTitle>
            <DialogDescription>
              KYC verification is under development
            </DialogDescription>
          </DialogHeader>
          
          {/* Move div content outside of DialogDescription */}
          <div className="mt-4 space-y-4">
            <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-300">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <p className="text-center font-medium dark:text-blue-200">
                This feature will be available soon
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Thank you for your patience
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}