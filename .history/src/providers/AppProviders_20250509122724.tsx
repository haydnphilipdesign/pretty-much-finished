import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider as Toast} from "../components/ui/toast";
import { TransactionFormProvider } from "../context/TransactionFormContext";
import { SlideshowProvider } from "../context/GlobalSlideshowContext";
import SmoothNavigationProvider from "./SmoothNavigationProvider";

const queryClient = new QueryClient();

interface AppProvidersProps {
	children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<TransactionFormProvider>
				<SlideshowProvider>
					<Toast>{children}</Toast>
				</SlideshowProvider>
			</TransactionFormProvider>
		</QueryClientProvider>
	);
};

export default AppProviders;