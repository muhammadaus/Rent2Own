import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { NFT } from "~~/types/NFT";
import { notification } from "~~/utils/scaffold-eth";

export function useFetchNFTs() {
  const { address: connectedAddress } = useAccount();
  const { data: myNFTContract } = useScaffoldContract({
    contractName: "MyNFT",
  });

  const fetchNFTs = async (currentNftAddress?: string): Promise<NFT[]> => {
    if (!myNFTContract || !connectedAddress) {
      notification.error("Contract not available.");
      return [];
    }
    const nfts = [];
    const contractAddress = currentNftAddress || myNFTContract.address;

    try {
      //TODO use contractAddress to get tokenId, ownerOf, tokenURI and contract name

      // Fetch current token ID
      const currentTokenId = await myNFTContract.read.getCurrentTokenId();
      const parsedTokenId = parseInt(currentTokenId.toString());

      //load only nfts owned by current address
      for (let i = 1; i <= parsedTokenId; i++) {
        const owner = await myNFTContract.read.ownerOf([BigInt(i)]);
        if (owner === connectedAddress) {
          const tokenURI = await myNFTContract.read.tokenURI([BigInt(i)]);
          nfts.push({
            name: await myNFTContract.read.name(),
            tokenId: `${i}`,
            tokenURI: tokenURI.toString(),
            contractAddress,
          });
        }
      }

      return nfts;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      notification.error("Failed to load NFTs.");
      return [];
    }
  };

  return { fetchNFTs };
}