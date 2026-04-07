import React from 'react';
import { Icons } from '../../components/Icons';
import { formatDistanceToNow } from 'date-fns';
import { useAuditLog } from '../../hooks/useAuditLog';

const AuditLog = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useAuditLog();

  const allLogs = data?.pages.flatMap((page) => page.logs) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in p-6 fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Audit Logs
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            A traceable history of all administrative actions and system-wide
            events.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Live Monitoring Activity
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {allLogs.length > 0 ? (
            allLogs.map((log) => (
              <div
                key={log._id}
                className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/80 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                      log.action.toLowerCase().includes("approved") || log.action.toLowerCase().includes("registered") || log.action.toLowerCase().includes("created")
                        ? "bg-green-100 text-green-600"
                        : log.action.toLowerCase().includes("rejected") || log.action.toLowerCase().includes("deactivated")
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    <Icons.Report className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-1 opacity-70">
                      {log.action}
                    </p>
                    <p className="text-gray-600 font-medium">
                      Targeted{" "}
                      <span className="text-gray-900 font-bold">
                        {log.targetType}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {log.userId?.fullName || "System"}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black uppercase rounded-md text-gray-500">
                      {log.userId?.role || "CORE"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : !isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Icons.Report className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No logs found</h3>
              <p className="text-gray-500 max-w-xs mt-2">
                There are currently no administrative actions recorded in the
                system.
              </p>
            </div>
          ) : null}

          {/* LOADING STATE SKELETON */}
          {isLoading && (
            <div className="p-12 flex justify-center">
              <div className="flex items-center gap-3 text-gray-400 font-medium animate-pulse">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Loading logs...
              </div>
            </div>
          )}
        </div>

        {/* LOAD MORE BUTTON */}
         {
          allLogs && allLogs.length > 0 ? <div className="flex flex-col items-center justify-center p-8">
          <button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage || !hasNextPage}
            className="group relative flex items-center gap-3 px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm transition-all duration-200 hover:bg-gray-900 hover:text-white cursor-pointer hover:border-gray-900 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isFetchingNextPage ? (
              <>
                
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Loading Logs...</span>
              </>
            ) : (
              <>
                <span>Load More</span>
               
               
              </>
            )}
          </button>

          {/* Small status text underneath */}
          {!hasNextPage && allLogs.length > 0 && (
            <p className="mt-4 text-xs font-medium text-gray-700 uppercase tracking-widest">
              End of Audit Trail
            </p>
          )}
        </div> : null
          }

      </div>
    </div>
  );
};

export default AuditLog;