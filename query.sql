
--ADD IN THE GENERAL PARAMETER SETS

INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'full'
AND p.parameter_type IN ('all','full')


INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'single'
AND p.parameter_type IN ('all','single')

INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
period_type = 'both'
AND p.parameter_type IN ('all','single','full')


INSERT INTO NODE_REPORT_subsectionparameters 
SELECT
ss.id AS subsectionId,
p.id AS parameterId
from 
[dbo].[NODE_REPORT_subsections] ss,
[dbo].[NODE_REPORT_parameters] p
WHERE
[type] IN ('template','appendix template')
AND p.name IN ('database')









--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
-- ####### #     #  #####  ### ####### #     #     #####  ####### ######  #     # ###  #####  #######    ######  ####### ######  ####### ######  ####### 
-- #       #     # #     #  #  #     # ##    #    #     # #       #     # #     #  #  #     # #          #     # #       #     # #     # #     #    #    
-- #       #     # #        #  #     # # #   #    #       #       #     # #     #  #  #       #          #     # #       #     # #     # #     #    #    
-- #####   #     #  #####   #  #     # #  #  #     #####  #####   ######  #     #  #  #       #####      ######  #####   ######  #     # ######     #    
-- #       #     #       #  #  #     # #   # #          # #       #   #    #   #   #  #       #          #   #   #       #       #     # #   #      #    
-- #       #     # #     #  #  #     # #    ##    #     # #       #    #    # #    #  #     # #          #    #  #       #       #     # #    #     #    
-- #        #####   #####  ### ####### #     #     #####  ####### #     #    #    ###  #####  #######    #     # ####### #       ####### #     #    #   
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 1 as [Order]
-- ,'Executive Summary' AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Fusion - Service Report'
-- AND s.name = 'Executive Summary'
-- AND sb.name IN ('Template - Executive Summary')

-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 2 as [Order]
-- ,'Littlefish Performance Against SLA' AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Fusion - Service Report'
-- AND s.name = 'Executive Summary'
-- AND sb.name IN ('SLA - Summary - full period')

-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 3 as [Order]
-- ,'Support Request Volumes' AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Fusion - Service Report'
-- AND s.name = 'Executive Summary'
-- AND sb.name IN ('Support Requests - Total Volume Flow Diagram - single period')

-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 4 as [Order]
-- ,'Customer Satisfaction Measurements' AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Fusion - Service Report'
-- AND s.name = 'Executive Summary'
-- AND sb.name IN ('CSAT - Customer Satisfaction Measurements - single period')

------------------------------------------------------------------------------------------------------SERVICE DESK
/*

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Telephony' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Telephony - Summary - full period')



INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Support Requests by Time of Day' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Heatmaps for Total Registered Tickets - single and full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Support Requests by Source' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Source - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Support Requests by Location' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Location - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Customer Satisfaction Measurement' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
6 as [Order]
,'Service Feedback Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - Service Feedback Summary - single period')


------------------------------------------------------------------------------------------------------INCIDENT MANAGEMENT


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Major Incident Review' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Major Incident Review - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'First Contact Resolution' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - FCR - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Volumes of Incidents by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Priority - full period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Category Trends - Within Top 5 Category Types, Last 3 Months' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Category Trends - full period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Top 5 Incidents by Category and Subcategory' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Top 5 Categories with Subcategory - single period')


------------------------------------------------------------------------------------------------------REQUESTS


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Top 5 Requests by Category and Subcategory' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Top 5 Categories with Subcategory - single period')


------------------------------------------------------------------------------------------------------PROBLEM MANAGEMENT

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Active and Closed Problems Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Open and Closed - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Problems Open/Closed' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Open and Closed - full period')


------------------------------------------------------------------------------------------------------Service Review Meetings Actions Register

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Service Review Meetings Actions Register'
AND sb.name IN ('Template - Actions Register')

------------------------------------------------------------------------------------------------------Appendix A - Positive Customer Feedback

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Appendix A - Positive Customer Feedback'
AND sb.name IN ('Appendix - CSAT - Positive Customer Feedback - single period')

------------------------------------------------------------------------------------------------------Appendix B - Trended Volumes for Reference

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Appendix B - Trended Volumes for Reference'
AND sb.name IN ('Appendix - Trended Volumes for Reference - full period')

------------------------------------------------------------------------------------------------------Appendix C - Category Trends - Within Top 15 Category Types


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Fusion - Service Report'
AND s.name = 'Appendix C - Category Trends - Within Top 15 Category Types'
AND sb.name IN ('Appendix - Category Trends Top 15 - full period')
*/



--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--  #####  ####### ######  #     # ###  #####  #######    ######  ####### ######  ####### ######  ####### 
-- #     # #       #     # #     #  #  #     # #          #     # #       #     # #     # #     #    #    
-- #       #       #     # #     #  #  #       #          #     # #       #     # #     # #     #    #    
--  #####  #####   ######  #     #  #  #       #####      ######  #####   ######  #     # ######     #    
--       # #       #   #    #   #   #  #       #          #   #   #       #       #     # #   #      #    
-- #     # #       #    #    # #    #  #     # #          #    #  #       #       #     # #    #     #    
--  #####  ####### #     #    #    ###  #####  #######    #     # ####### #       ####### #     #    #    
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
--//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Executive Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('Template - Executive Summary')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Littlefish Performance Against SLA' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('SLA - SLA Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Support Request Volumes' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('Support Requests - Total Volume Flow Diagram - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Customer Satisfaction Measurements' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Executive Summary'
AND sb.name IN ('CSAT - CSAT Overview - single period')

------------------------------------------------------------------------------------------------------SERVICE DESK


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Telephony' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Telephony - Summary - full period')



INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Abandoned Calls Heatmaps' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Telephony - Abandoned Call Heatmaps - single period')



INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Support Requests by Time of Day' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Time of Day - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3.5 as [Order]
,'Heatmaps for Total Registered Tickets' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Heatmaps for Total Registered Tickets - single and full period')



INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Support Requests by Source' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Source - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Support Requests by Location' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Location - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
6 as [Order]
,'Support Requests by Type' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Volume by Type Per Period - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
7 as [Order]
,'Customer Satisfaction Measurement' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - CSAT Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
8 as [Order]
,'CSAT Feedback Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - CSAT Feedback - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
9 as [Order]
,'NPS Feedback' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - NPS Summary - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
10 as [Order]
,'NPS Feedback Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('CSAT - NPS Feedback - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
11 as [Order]
,'VIP Support Requests' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - VIP - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
12 as [Order]
,'VIP Support Requests List' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Top 10 VIPs Raising Requests - single period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
13 as [Order]
,'Support Requests Opened and Resolved per Month per Resolver Group' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Desk'
AND sb.name IN ('Support Requests - Trending per Month per Resolver Team - full period')

------------------------------------------------------------------------------------------------------INCIDENT MANAGEMENT


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Major Incident Review' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Major Incident Review - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'First Contact Resolution' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - FCR - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'Volumes of Incidents by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Customer Experience Mean Time to Resolution by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Customer Experience Mean Time to Resolution by Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'SLA Clock Mean Time to Resolution by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - SLA Clock Mean Time to Resolution by Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
6 as [Order]
,'Incidents Opened and Resolved per Month' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Opened and Resolved - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
7 as [Order]
,'Incidents Closed by Littlefish' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Closed by Littlefish - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
8 as [Order]
,'Customer and Third-Party Incidents Closed by Resolver Group' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Closed by Non LF Resolvers - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
9 as [Order]
,'Incidents Tail by Resolver Group' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Tail by Resolver Group - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
10 as [Order]
,'Top 5 Category Volume Trend' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Top 5 Category Trends - full period')


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
11 as [Order]
,'Top 5 Incidents by Categories' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Top 5 Categories with Subcategory breakdown - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
12 as [Order]
,'Top 10 Users Raising Incidents' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Incident Management'
AND sb.name IN ('Incidents - Top 10 Users Raising Incidents - single period')

------------------------------------------------------------------------------------------------------REQUESTS

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Volume of Requests by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Customer Experience Mean Time to Resolution by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Customer Experience Mean Time to Resolution by Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'SLA Clock Mean Time to Resolution by Priority' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - SLA Clock Mean Time to Resolution by Priority - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'Top 5 Requests by Categories' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Top 5 Categories with Subcategory breakdown - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
5 as [Order]
,'Request Resolution Performance' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Requests'
AND sb.name IN ('Requests - Resolution Performance - full period')

------------------------------------------------------------------------------------------------------PROBLEM MANAGEMENT

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'Active and Closed Problems Summary' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Open and Closed - single period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'Problems Open/Closed' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Problem Management'
AND sb.name IN ('Problems - Opened and Closed - full period')

------------------------------------------------------------------------------------------------------KNOWLEDGE

-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 1 as [Order]
-- ,NULL AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Service Report'
-- AND s.name = 'Knowledge'
-- AND sb.name IN ('Knowledge - Base Growth - full period')

------------------------------------------------------------------------------------------------------CHANGE

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,'RFCs Raised, Reviewed and Outcomes' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Change'
AND sb.name IN ('Change - Status - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
2 as [Order]
,'RFCs by Type of Change' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Change'
AND sb.name IN ('Change - Type of Change - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
3 as [Order]
,'RFC Implementation' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Change'
AND sb.name IN ('Change - Implementation - full period')

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
4 as [Order]
,'RFC Implementation Results' AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Change'
AND sb.name IN ('Change - Implementation Result - full period')

------------------------------------------------------------------------------------------------------Continual Service Improvements

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Continual Service Improvement (CSI)'
AND sb.name IN ('Template - Continual Service Improvement')

------------------------------------------------------------------------------------------------------Service Review Meetings Actions Register

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Service Review Meetings Actions Register'
AND sb.name IN ('Template - Actions Register')



------------------------------------------------------------------------------------------------------Appendix A - Positive Customer Feedback

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix A - Positive CSAT Feedback'
AND sb.name IN ('Appendix - CSAT - Positive CSAT Feedback - single period')

------------------------------------------------------------------------------------------------------Appendix B - Positive NPS Feedback

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix B - Positive NPS Feedback'
AND sb.name IN ('Appendix - CSAT - Positive NPS Feedback - single period')



------------------------------------------------------------------------------------------------------Appendix C - Trended Volumes for Reference

-- INSERT INTO [NODE_REPORT_sectionsubsections]
-- SELECT 
-- 1 as [Order]
-- ,NULL AS name
-- ,s.id AS [sectionId]
-- ,sb.id AS [subsectionId]
-- FROM 
-- [dbo].[NODE_REPORT_reports] r
-- LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
-- [dbo].[NODE_REPORT_subsections] sb
-- WHERE
-- r.name = 'Service Report'
-- AND s.name = 'Appendix C - Trended Volumes for Reference'
-- AND sb.name IN ('Appendix - Trended Volumes for Reference - full period')

------------------------------------------------------------------------------------------------------Appendix D - Incident Tail Details

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix D - Incident Tail Details'
AND sb.name IN ('Appendix - Incidents - Tail Extract - single period')

------------------------------------------------------------------------------------------------------Appendix E - VIP Support Requests

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix E - VIP Support Requests'
AND sb.name IN ('Appendix - Support Requests - VIP Raised Tickets - single period')

-----------------------------------------------------------------------------------------------------Appendix F - RFCs Raised and Reviewed this period

INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix F - RFCs Raised and Reviewed this period'
AND sb.name IN ('Appendix - Changes - Status - single period')

------------------------------------------------------------------------------------------------------Appendix G - Category Trends - Within Top 15 Category Types


INSERT INTO [NODE_REPORT_sectionsubsections]
SELECT 
1 as [Order]
,NULL AS name
,s.id AS [sectionId]
,sb.id AS [subsectionId]
FROM 
[dbo].[NODE_REPORT_reports] r
LEFT JOIN [dbo].[NODE_REPORT_sections] s ON (s.reportId = r.id),
[dbo].[NODE_REPORT_subsections] sb
WHERE
r.name = 'Service Report'
AND s.name = 'Appendix G - Top 15 Category Trends'
AND sb.name IN ('Appendix - Incidents - Top 15 Category Trends - full period')

