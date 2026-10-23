
def GetFailedLogin(data):

    store_failed_event = []
    count_failed_event = 0

    for event_type in data:
        if event_type == "login failed":
            store_failed_event.append(event_type)
            count_failed_event = count_failed_event + 1

        else:
            pass

    return count_failed_event

def ScanHost_IP(hostIP):

    group_same_host_ip = {}

    for i in hostIP:
        count_ip = 0
        for x in range(len(hostIP)):
            if i == hostIP[x]:
                count_ip = count_ip + 1

            else: 
                pass

            group_same_host_ip[i] = count_ip

    return group_same_host_ip



def collectInfo(info):
    print(info)




def display(info):

    hostIP = {}
    for i in info:
        count = 0
        # print(info[i]["id"])

        for x in range(len(info)):
            if info[i]["ip_address"] == info[x+1]["ip_address"]:
                count = count + 1
            else:
                continue

            hostIP[info[i]["ip_address"]] = {
                "ip_address" : info[i]["ip_address"],
                "attempt" : count
            }

    for i in hostIP:
        # print(i)
        # print(hostIP[i])

        if hostIP[i]["attempt"] >= 25:
            hostIP[i]["severity"] = "Critical"

        elif hostIP[i]["attempt"] >= 20:
            hostIP[i]["severity"] = "High"

        elif hostIP[i]["attempt"] >= 10:
            hostIP[i]["severity"] = "Medium"

        elif hostIP[i]["attempt"] >= 1:
            hostIP[i]["severity"] = "Low"

        else:
            continue

    return hostIP

        