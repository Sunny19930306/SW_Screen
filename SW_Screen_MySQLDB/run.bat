@echo off

REM http://blogs.msdn.com/b/david.wang/archive/2006/03/26/howto-detect-process-bitness.aspx
REM http://stackoverflow.com/questions/12372578/using-windows-command-in-cmd-to-test-if-32-bit-or-64-bit-and-run-a-command

SET _Bitness=64

start %_Bitness%\start_db.bat
start %_Bitness%\start_node.bat
@ping 127.0.0.1 -n 6 > nul
start http://127.0.0.1:8080/