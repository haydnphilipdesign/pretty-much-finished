import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider as Toast} from "../components/ui/toast";
import { TransactionFormProvider } from "../context/TransactionFormContext";
import { SlideshowProvider } from "../context/GlobalSlideshowContext";
import { GlobalLinkProvider } from "../components/GlobalLinkProvider";

const queryClient = new QueryClient();

interface AppProvidersProps {
	children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<TransactionFormProvider>
				<SlideshowProvider>
					<GlobalLinkProvider
						scrollDuration={400}
						heroVisibilityDelay={200}
					>
						<Toast>{children}</Toast>
					</GlobalLinkProvider>
				</SlideshowProvider>
			</TransactionFormProvider>
		</QueryClientProvider>
	);
};

export default AppProviders;